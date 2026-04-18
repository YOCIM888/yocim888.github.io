#!/usr/bin/env python3
"""
JSON死链检测与自动修复脚本
- 低并发、随机延迟、随机User-Agent
- 指数退避重试、代理支持
"""

import asyncio
import json
import argparse
import sys
import random
from pathlib import Path
from typing import Dict, Set, List, Tuple, Any, Union
from collections import Counter
from urllib.parse import urlparse
from datetime import datetime

import aiohttp
from aiohttp import ClientTimeout, ClientSession, TCPConnector
from tqdm import tqdm

# ==================== 反拉黑配置 ====================
MAX_CONCURRENT = 10               
REQUEST_TIMEOUT = 30
RETRIES = 3                      
BASE_DELAY = 0.5                 
MAX_DELAY = 2.0                  
BACKOFF_FACTOR = 2              

# 随机User-Agent池
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0",
]

EXTRA_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
}

# 有效状态码（不包括429、403等反爬状态码）
VALID_STATUS_CODES = set(range(200, 400))   # 只认2xx/3xx，4xx/5xx视为无效

TRY_HTTPS_UPGRADE = True
FOLLOW_REDIRECTS = True
GENERATE_REPORT = True

# 代理配置（None表示不使用代理，也可在命令行指定）
PROXY = None
# ===================================================

def get_random_headers():
    """生成随机请求头"""
    headers = {
        "User-Agent": random.choice(USER_AGENTS),
        **EXTRA_HEADERS
    }
    return headers

def extract_urls(data: Union[Dict, List, Any]) -> Set[str]:
    """递归提取所有URL"""
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
    """自定义URL替换规则（预留）"""
    return url

def is_missing_link(error_msg: str) -> bool:
    """判断是否为404/410"""
    return error_msg.startswith("HTTP 404") or error_msg.startswith("HTTP 410")

async def check_url(session: ClientSession, url: str, retries: int = RETRIES) -> Tuple[str, bool, str, str]:
    """
    检查URL，支持指数退避重试，返回 (原始URL, 是否有效, 最终URL, 消息)
    """
    test_url = apply_custom_rules(url)
    last_error = None
    delay = BASE_DELAY

    for attempt in range(retries + 1):
        try:
            # 随机延迟，避免请求过于规律
            await asyncio.sleep(random.uniform(BASE_DELAY, MAX_DELAY))

            # 每次请求使用随机User-Agent
            session._headers.update(get_random_headers())

            # 先尝试HEAD
            resp = await session.head(test_url, allow_redirects=FOLLOW_REDIRECTS, timeout=REQUEST_TIMEOUT)
            status = resp.status

            # 处理429（请求过多）或5xx：触发退避重试
            if status == 429 or status >= 500:
                if attempt < retries:
                    wait_time = delay * (BACKOFF_FACTOR ** attempt) + random.uniform(0, 1)
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    return url, False, test_url, f"HTTP {status} (重试后仍失败)"

            if status in VALID_STATUS_CODES:
                if test_url != url:
                    return url, True, test_url, "有效(规则替换)"
                return url, True, url, "有效"

            # HEAD不被允许时改用GET
            if status == 405:
                resp = await session.get(test_url, allow_redirects=FOLLOW_REDIRECTS, timeout=REQUEST_TIMEOUT)
                await resp.release()
                if resp.status in VALID_STATUS_CODES:
                    if test_url != url:
                        return url, True, test_url, "有效(GET,规则替换)"
                    return url, True, url, "有效(GET)"

            # 未自动跟随的重定向
            if not FOLLOW_REDIRECTS and status in (301, 302, 307, 308):
                location = resp.headers.get('Location')
                if location:
                    if location.startswith('/'):
                        parsed = urlparse(test_url)
                        location = f"{parsed.scheme}://{parsed.netloc}{location}"
                    return url, True, location, f"重定向到 {location}"

            # HTTPS升级尝试
            if TRY_HTTPS_UPGRADE and test_url.startswith('http://'):
                https_url = test_url.replace('http://', 'https://', 1)
                try:
                    https_resp = await session.head(https_url, allow_redirects=FOLLOW_REDIRECTS, timeout=REQUEST_TIMEOUT)
                    if https_resp.status in VALID_STATUS_CODES:
                        return url, True, https_url, "HTTPS升级成功"
                except:
                    pass

            # 其他4xx状态码视为无效
            return url, False, test_url, f"HTTP {status}"

        except asyncio.TimeoutError:
            last_error = "超时"
            if attempt < retries:
                await asyncio.sleep(delay * (BACKOFF_FACTOR ** attempt))
                continue
        except aiohttp.ClientConnectionError as e:
            last_error = f"连接错误: {str(e)}"
            if attempt < retries:
                await asyncio.sleep(delay * (BACKOFF_FACTOR ** attempt))
                continue
        except aiohttp.ClientResponseError as e:
            # 服务器返回错误状态码
            if e.status in VALID_STATUS_CODES:
                return url, True, test_url, f"有效(异常码{e.status})"
            return url, False, test_url, f"HTTP {e.status}"
        except Exception as e:
            last_error = f"错误: {str(e)}"
            if attempt < retries:
                await asyncio.sleep(delay * (BACKOFF_FACTOR ** attempt))
                continue

    return url, False, test_url, last_error or "未知错误"

async def check_all_urls(urls: Set[str]) -> Dict[str, Tuple[bool, str, str]]:
    """并发检查所有URL，带全局请求间隔控制"""
    if not urls:
        return {}

    # 限制并发连接数，避免同时发出太多请求
    connector = TCPConnector(limit=MAX_CONCURRENT, limit_per_host=MAX_CONCURRENT)
    timeout = ClientTimeout(total=REQUEST_TIMEOUT * (RETRIES + 1))

    results = {}
    # 使用共享的CookieJar模拟浏览器会话
    async with ClientSession(connector=connector, timeout=timeout, cookie_jar=aiohttp.CookieJar()) as session:
        # 如果有代理，设置代理
        if PROXY:
            session._proxy = PROXY

        # 使用信号量控制总并发（双重保险）
        semaphore = asyncio.Semaphore(MAX_CONCURRENT)

        async def limited_check(url):
            async with semaphore:
                return await check_url(session, url)

        tasks = [limited_check(url) for url in urls]
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
        if len(dead_urls) > 0:
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
    """导出缺失链接"""
    with open(filename, 'w', encoding='utf-8') as f:
        for url, (_, final_url, msg) in missing_links.items():
            f.write(f"{url}\t{final_url}\t{msg}\n")
    print(f"缺失链接已导出至: {filename}")

def main():
    parser = argparse.ArgumentParser(description="JSON死链检测与自动修复（反拉黑版）")
    parser.add_argument("json_file", help="JSON文件路径")
    parser.add_argument("--output", "-o", help="输出文件路径")
    parser.add_argument("--no-fix", action="store_true", help="只检测不修复")
    parser.add_argument("--report-only", action="store_true", help="只生成报告，不保存修复后的文件")
    parser.add_argument("--only-missing", action="store_true", help="只显示404/410链接")
    parser.add_argument("--export-missing", metavar="FILE", help="导出404/410链接到文件")
    parser.add_argument("--timeout", type=int, help="超时时间（秒）")
    parser.add_argument("--retries", type=int, help="重试次数")
    parser.add_argument("--concurrent", type=int, help="并发数（建议<=10）")
    parser.add_argument("--proxy", help="代理地址，例如 http://127.0.0.1:8080")
    args = parser.parse_args()

    # 覆盖全局配置
    global REQUEST_TIMEOUT, RETRIES, MAX_CONCURRENT, PROXY
    if args.timeout:
        REQUEST_TIMEOUT = args.timeout
    if args.retries is not None:
        RETRIES = args.retries
    if args.concurrent:
        MAX_CONCURRENT = args.concurrent
        print(f"使用并发数: {MAX_CONCURRENT}")
    if args.proxy:
        PROXY = args.proxy
        print(f"使用代理: {PROXY}")

    # 读取JSON
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

    # 检查所有URL
    print("开始检查链接有效性（低并发+随机延迟，避免封禁）...")
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

    if args.only_missing:
        if missing_links:
            print("\n页面不存在的链接（404/410）:")
            for url, (_, final_url, msg) in missing_links.items():
                print(f"  {url} → {final_url} ({msg})")
        else:
            print("没有发现页面不存在的链接。")
        return

    if args.export_missing:
        export_missing_links(missing_links, args.export_missing)

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