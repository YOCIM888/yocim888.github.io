#!/usr/bin/env python3
"""
JSON死链检测与自动修复脚本（增强版）
- 支持重试、自定义状态码、更真实的请求头
- 减少误报，提高准确率
"""

import asyncio
import json
import argparse
import sys
from pathlib import Path
from typing import Dict, Set, List, Tuple, Any, Union
from collections import Counter
from urllib.parse import urlparse
from datetime import datetime

import aiohttp
from aiohttp import ClientTimeout, ClientSession, TCPConnector
from tqdm import tqdm

# ==================== 配置区域（可自由修改） ====================
REQUEST_TIMEOUT = 30                 
MAX_CONCURRENT = 100                 
RETRIES = 2                          
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
# 额外请求头，模拟真实浏览器
EXTRA_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

# 有效状态码范围（可根据需要添加临时性状态码）
VALID_STATUS_CODES = set(range(200, 400)) | {400,403, 429, 500, 502, 503, 504}
# 若希望严格只认2xx-3xx，可改为 range(200,400)

TRY_HTTPS_UPGRADE = True
FOLLOW_REDIRECTS = True
GENERATE_REPORT = True
# ==============================================================

def extract_urls(data: Union[Dict, List, Any]) -> Set[str]:
    """递归提取所有以http://或https://开头的字符串"""
    urls = set()
    if isinstance(data, dict):
        for value in data.values():
            urls.update(extract_urls(value))
    elif isinstance(data, list):
        for item in data:
            urls.update(extract_urls(item))
    elif isinstance(data, str) and (data.startswith("http://") or data.startswith("https://")):
        urls.add(data)
    return urls


def apply_custom_rules(url: str) -> str:
    """应用自定义替换规则（可在外部定义）"""
    # 示例：CUSTOM_REPLACE_RULES = {"oldsite.com": "newsite.com"}
    return url  # 暂留空，用户可自行扩展


def is_missing_link(error_msg: str) -> bool:
    """判断错误信息是否表示页面不存在（404/410）"""
    return error_msg.startswith("HTTP 404") or error_msg.startswith("HTTP 410")


async def check_url(session: ClientSession, url: str, retries: int = RETRIES) -> Tuple[str, bool, str, str]:
    """
    检查URL，支持重试，返回 (原始URL, 是否有效, 最终URL, 消息)
    """
    test_url = apply_custom_rules(url)
    last_error = None

    for attempt in range(retries + 1):
        try:
            # 先尝试HEAD请求
            resp = await session.head(test_url, allow_redirects=FOLLOW_REDIRECTS, timeout=REQUEST_TIMEOUT)
            if resp.status in VALID_STATUS_CODES:
                if test_url != url:
                    return url, True, test_url, f"有效(通过自定义规则)"
                return url, True, url, f"有效"
            # 若HEAD不被允许（405），改用GET
            elif resp.status == 405:
                resp = await session.get(test_url, allow_redirects=FOLLOW_REDIRECTS, timeout=REQUEST_TIMEOUT)
                await resp.release()
                if resp.status in VALID_STATUS_CODES:
                    if test_url != url:
                        return url, True, test_url, f"有效(GET,自定义规则)"
                    return url, True, url, f"有效(GET)"

            # 如果未命中有效状态码，检查重定向（若未自动跟随）
            if not FOLLOW_REDIRECTS and resp.status in (301, 302, 307, 308):
                location = resp.headers.get('Location')
                if location:
                    if location.startswith('/'):
                        parsed = urlparse(test_url)
                        location = f"{parsed.scheme}://{parsed.netloc}{location}"
                    return url, True, location, f"重定向到 {location}"

            # 尝试HTTPS升级
            if TRY_HTTPS_UPGRADE and test_url.startswith('http://'):
                https_url = test_url.replace('http://', 'https://', 1)
                try:
                    https_resp = await session.head(https_url, allow_redirects=FOLLOW_REDIRECTS, timeout=REQUEST_TIMEOUT)
                    if https_resp.status in VALID_STATUS_CODES:
                        return url, True, https_url, f"HTTPS升级成功"
                except:
                    pass

            # 最终失败，返回状态码
            return url, False, test_url, f"HTTP {resp.status}"

        except asyncio.TimeoutError:
            last_error = "超时"
            if attempt < retries:
                await asyncio.sleep(1)  # 等待1秒后重试
                continue
        except aiohttp.ClientConnectionError as e:
            last_error = f"连接错误: {str(e)}"
            if attempt < retries:
                await asyncio.sleep(1)
                continue
        except aiohttp.ClientResponseError as e:
            # 如果服务器返回了错误状态码（如404），这里会捕获，但我们需要状态码信息
            # 可以尝试从异常中获取状态码
            if e.status in VALID_STATUS_CODES:
                # 理论上不会进这里，但以防万一
                return url, True, test_url, f"有效(异常码{e.status})"
            return url, False, test_url, f"HTTP {e.status}"
        except Exception as e:
            last_error = f"错误: {str(e)}"
            if attempt < retries:
                await asyncio.sleep(1)
                continue

    # 所有重试均失败
    return url, False, test_url, last_error or "未知错误"


async def check_all_urls(urls: Set[str]) -> Dict[str, Tuple[bool, str, str]]:
    """并发检查所有URL"""
    if not urls:
        return {}
    
    connector = TCPConnector(limit=MAX_CONCURRENT)
    timeout = ClientTimeout(total=REQUEST_TIMEOUT * (RETRIES + 1))  # 总超时适当放宽
    headers = {"User-Agent": USER_AGENT, **EXTRA_HEADERS}
    
    results = {}
    async with ClientSession(connector=connector, timeout=timeout, headers=headers) as session:
        tasks = [check_url(session, url) for url in urls]
        
        for future in tqdm(asyncio.as_completed(tasks), total=len(tasks), desc="检查链接", unit="url"):
            original_url, is_valid, final_url, message = await future
            results[original_url] = (is_valid, final_url, message)
    
    return results


def fix_json_data(data: Any, url_mapping: Dict[str, Tuple[bool, str, str]]) -> Any:
    """递归修复JSON中的URL"""
    if isinstance(data, dict):
        return {k: fix_json_data(v, url_mapping) for k, v in data.items()}
    elif isinstance(data, list):
        return [fix_json_data(item, url_mapping) for item in data]
    elif isinstance(data, str) and data in url_mapping:
        is_valid, final_url, _ = url_mapping[data]
        if not is_valid or final_url != data:
            return final_url
        return data
    else:
        return data


def generate_report(dead_urls: Dict[str, Tuple[bool, str, str]], 
                    fixed_count: int, 
                    output_file: str):
    """生成修复报告"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    report_file = output_file.replace('.json', '_report.txt')
    
    missing_links = {url: (is_valid, final_url, msg) 
                     for url, (is_valid, final_url, msg) in dead_urls.items()
                     if not is_valid and is_missing_link(msg)}
    other_errors = {url: (is_valid, final_url, msg) 
                    for url, (is_valid, final_url, msg) in dead_urls.items()
                    if not is_valid and not is_missing_link(msg)}
    
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(f"JSON死链修复报告\n")
        f.write(f"生成时间: {timestamp}\n")
        f.write(f"{'='*60}\n\n")
        f.write(f"修复统计:\n")
        f.write(f"  总死链数: {len(dead_urls)}\n")
        f.write(f"  成功修复: {fixed_count}\n")
        f.write(f"  修复率: {fixed_count/len(dead_urls)*100:.1f}%\n\n")
        f.write(f"页面不存在（404/410）: {len(missing_links)}\n")
        f.write(f"其他错误: {len(other_errors)}\n\n")
        
        domains = [urlparse(url).netloc for url in dead_urls.keys()]
        f.write("死链域名TOP10:\n")
        for domain, count in Counter(domains).most_common(10):
            f.write(f"  {domain}: {count}个\n")
        f.write("\n")
        
        f.write("死链详情:\n")
        for url, (is_valid, final_url, message) in dead_urls.items():
            if not is_valid and is_missing_link(message):
                status = "❌ 页面不存在"
            elif final_url != url:
                status = "✅ 已修复"
            else:
                status = "❌ 修复失败"
            f.write(f"  {url}\n")
            f.write(f"    {status} → {final_url} ({message})\n")
    
    print(f"\n修复报告已保存至: {report_file}")


def export_missing_links(missing_links: Dict[str, Tuple[bool, str, str]], filename: str):
    """导出缺失链接到文件"""
    with open(filename, 'w', encoding='utf-8') as f:
        for url, (_, final_url, msg) in missing_links.items():
            f.write(f"{url}\t{final_url}\t{msg}\n")
    print(f"缺失链接已导出至: {filename}")


def main():
    parser = argparse.ArgumentParser(description="JSON死链检测与自动修复（增强版）")
    parser.add_argument("json_file", help="JSON文件路径")
    parser.add_argument("--output", "-o", help="输出文件路径")
    parser.add_argument("--no-fix", action="store_true", help="只检测不修复")
    parser.add_argument("--report-only", action="store_true", help="只生成报告，不保存修复后的文件")
    parser.add_argument("--only-missing", action="store_true", help="只显示404/410链接")
    parser.add_argument("--export-missing", metavar="FILE", help="导出404/410链接到文件")
    parser.add_argument("--timeout", type=int, help="超时时间（秒）")
    parser.add_argument("--retries", type=int, help="重试次数")
    parser.add_argument("--valid-status", nargs="+", type=int, help="有效状态码列表，如 200 301 403")
    args = parser.parse_args()

    # 读取JSON文件
    input_file = Path(args.json_file)
    if not input_file.exists():
        print(f"错误: 文件 '{args.json_file}' 不存在。")
        sys.exit(1)
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            original_data = json.load(f)
    except Exception as e:
        print(f"错误: 无法读取JSON文件 - {e}")
        sys.exit(1)
    
    # 提取URL
    print("正在提取URL...")
    urls = extract_urls(original_data)
    print(f"找到 {len(urls)} 个URL。")
    if not urls:
        print("没有找到任何链接。")
        return

    # 覆盖配置
    global REQUEST_TIMEOUT, RETRIES, VALID_STATUS_CODES
    if args.timeout:
        REQUEST_TIMEOUT = args.timeout
    if args.retries is not None:
        RETRIES = args.retries
    if args.valid_status:
        VALID_STATUS_CODES = set(args.valid_status)
        print(f"使用自定义有效状态码: {sorted(VALID_STATUS_CODES)}")

    # 检查所有URL
    print("开始检查链接有效性...")
    results = asyncio.run(check_all_urls(urls))
    
    # 统计
    dead_urls = {url: (is_valid, final_url, msg) 
                 for url, (is_valid, final_url, msg) in results.items() 
                 if not is_valid or final_url != url}
    
    valid_count = sum(1 for is_valid, _, _ in results.values() if is_valid)
    dead_count = len(dead_urls)
    fixed_count = len([(url, info) for url, info in dead_urls.items() if info[1] != url])
    
    missing_links = {url: (is_valid, final_url, msg) 
                     for url, (is_valid, final_url, msg) in dead_urls.items()
                     if not is_valid and is_missing_link(msg)}
    
    print(f"\n检查完成:")
    print(f"  有效链接: {valid_count}")
    print(f"  死链总数: {dead_count}")
    print(f"  其中页面不存在（404/410）: {len(missing_links)}")
    print(f"  其他错误: {dead_count - len(missing_links)}")
    print(f"  可自动修复: {fixed_count}")
    
    # --only-missing
    if args.only_missing:
        if missing_links:
            print("\n页面不存在的链接（404/410）:")
            for url, (_, final_url, msg) in missing_links.items():
                print(f"  {url} → {final_url} ({msg})")
        else:
            print("没有发现页面不存在的链接。")
        return
    
    # --export-missing
    if args.export_missing:
        export_missing_links(missing_links, args.export_missing)
    
    # 只检测不修复
    if args.no_fix or args.report_only:
        if dead_urls:
            print("\n死链列表:")
            for url, (_, final_url, msg) in dead_urls.items():
                status = "✅ 可修复" if final_url != url else "❌ 死链"
                print(f"  {status} {url} -> {final_url} ({msg})")
        else:
            print("没有发现死链！")
        return
    
    # 确定输出文件名
    if args.output:
        output_file = args.output
    else:
        output_file = str(input_file).replace('.json', '_fixed.json')
        if output_file == str(input_file):
            output_file = str(input_file) + '_fixed.json'
    
    # 修复数据
    print(f"\n正在生成修复后的文件...")
    fixed_data = fix_json_data(original_data, {url: info for url, info in results.items()})
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(fixed_data, f, ensure_ascii=False, indent=2)
    print(f"修复后的文件已保存至: {output_file}")
    
    if GENERATE_REPORT:
        generate_report(dead_urls, fixed_count, output_file)
    
    failed_fixes = [(url, info) for url, info in dead_urls.items() if info[1] == url]
    if failed_fixes:
        print(f"\n以下 {len(failed_fixes)} 个链接无法自动修复，需要手动处理:")
        for url, (_, _, msg) in failed_fixes[:10]:
            print(f"  ❌ {url} ({msg})")
        if len(failed_fixes) > 10:
            print(f"  ... 还有 {len(failed_fixes)-10} 个")
    else:
        print("\n所有死链都已自动修复！")


if __name__ == "__main__":
    main()