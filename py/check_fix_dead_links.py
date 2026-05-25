#!/usr/bin/env python3
"""
JSON死链检测与自动修复脚本
- 低并发、随机延迟、随机User-Agent
- 指数退避重试、代理支持
- 自动构建支持
"""

import asyncio
import json
import argparse
import sys
import random
import subprocess
from pathlib import Path
from typing import Dict, Set, List, Tuple, Any, Union
from collections import Counter
from urllib.parse import urlparse
from datetime import datetime

import aiohttp
from aiohttp import ClientTimeout, ClientSession, TCPConnector
from tqdm import tqdm

try:
    from aiohttp_resolvers import AsyncResolver
    import aiodns
    HAS_AIODNS = True
except ImportError:
    HAS_AIODNS = False

MAX_CONCURRENT = 10
REQUEST_TIMEOUT = 30
RETRIES = 3
BASE_DELAY = 0.5
MAX_DELAY = 2.0
BACKOFF_FACTOR = 2

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

VALID_STATUS_CODES = set(range(200, 400))

TRY_HTTPS_UPGRADE = True
FOLLOW_REDIRECTS = True
GENERATE_REPORT = True
PROXY = None


def get_random_headers():
    headers = {
        "User-Agent": random.choice(USER_AGENTS),
        **EXTRA_HEADERS
    }
    return headers


def extract_urls(data: Union[Dict, List, Any]) -> Set[str]:
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
    return url


def is_missing_link(error_msg: str) -> bool:
    return error_msg.startswith("HTTP 404") or error_msg.startswith("HTTP 410")


async def check_url(session: ClientSession, url: str, retries: int = RETRIES) -> Tuple[str, bool, str, str]:
    test_url = apply_custom_rules(url)
    last_error = None
    delay = BASE_DELAY

    for attempt in range(retries + 1):
        try:
            await asyncio.sleep(random.uniform(BASE_DELAY, MAX_DELAY))

            headers = get_random_headers()

            resp = await session.head(
                test_url,
                headers=headers,
                allow_redirects=FOLLOW_REDIRECTS,
                timeout=REQUEST_TIMEOUT,
                proxy=PROXY,
            )
            status = resp.status

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

            if status == 405:
                resp = await session.get(
                    test_url,
                    headers=headers,
                    allow_redirects=FOLLOW_REDIRECTS,
                    timeout=REQUEST_TIMEOUT,
                    proxy=PROXY,
                )
                await resp.release()
                if resp.status in VALID_STATUS_CODES:
                    if test_url != url:
                        return url, True, test_url, "有效(GET,规则替换)"
                    return url, True, url, "有效(GET)"

            if not FOLLOW_REDIRECTS and status in (301, 302, 307, 308):
                location = resp.headers.get('Location')
                if location:
                    if location.startswith('/'):
                        parsed = urlparse(test_url)
                        location = f"{parsed.scheme}://{parsed.netloc}{location}"
                    return url, True, location, f"重定向到 {location}"

            if TRY_HTTPS_UPGRADE and test_url.startswith('http://'):
                https_url = test_url.replace('http://', 'https://', 1)
                try:
                    https_resp = await session.head(
                        https_url,
                        headers=headers,
                        allow_redirects=FOLLOW_REDIRECTS,
                        timeout=REQUEST_TIMEOUT,
                        proxy=PROXY,
                    )
                    if https_resp.status in VALID_STATUS_CODES:
                        return url, True, https_url, "HTTPS升级成功"
                except Exception:
                    pass

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
    if not urls:
        return {}

    connector_kwargs = {"limit": MAX_CONCURRENT, "limit_per_host": 2}
    if HAS_AIODNS:
        resolver = AsyncResolver()
        connector_kwargs["resolver"] = resolver

    connector = TCPConnector(**connector_kwargs)
    timeout = ClientTimeout(total=REQUEST_TIMEOUT * (RETRIES + 1))

    results = {}
    async with ClientSession(connector=connector, timeout=timeout, cookie_jar=aiohttp.CookieJar()) as session:
        semaphore = asyncio.Semaphore(MAX_CONCURRENT)

        async def limited_check(url):
            async with semaphore:
                return await check_url(session, url)

        tasks = [limited_check(url) for url in urls]
        completed = 0
        total = len(tasks)
        pbar = tqdm(total=total, desc="检查链接", unit="url")

        for coro in asyncio.as_completed(tasks):
            original_url, is_valid, final_url, message = await coro
            results[original_url] = (is_valid, final_url, message)
            completed += 1
            pbar.update(1)

        pbar.close()

    return results


def fix_json_data(data: Any, url_mapping: Dict[str, Tuple[bool, str, str]]) -> Any:
    if isinstance(data, dict):
        return {k: fix_json_data(v, url_mapping) for k, v in data.items()}
    elif isinstance(data, list):
        return [fix_json_data(item, url_mapping) for item in data]
    elif isinstance(data, str) and data in url_mapping:
        is_valid, final_url, _ = url_mapping[data]
        if not is_valid:
            return final_url
        if is_valid and final_url != data:
            return final_url
        return data
    else:
        return data


def generate_report(dead_urls: Dict[str, Tuple[bool, str, str]],
                    fixed_count: int,
                    output_file: str):
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
    with open(filename, 'w', encoding='utf-8') as f:
        for url, (_, final_url, msg) in missing_links.items():
            f.write(f"{url}\t{final_url}\t{msg}\n")
    print(f"缺失链接已导出至: {filename}")


def run_build():
    scripts_dir = Path(__file__).parent.parent / "scripts"
    build_js = scripts_dir / "build.js"
    if not build_js.exists():
        print("警告: 未找到构建脚本 scripts/build.js，跳过自动构建")
        return False

    print("\n正在运行构建脚本...")
    try:
        result = subprocess.run(
            [sys.executable.replace("python", "node"), str(build_js)],
            cwd=str(scripts_dir),
            capture_output=True,
            text=True,
            timeout=60,
        )
        if result.returncode == 0:
            print("✅ 构建成功！")
            return True
        else:
            print(f"❌ 构建失败: {result.stderr}")
            return False
    except FileNotFoundError:
        print("警告: 未找到 node 命令，跳过自动构建")
        return False
    except subprocess.TimeoutExpired:
        print("警告: 构建超时，跳过")
        return False


def main():
    parser = argparse.ArgumentParser(description="JSON死链检测与自动修复（反拉黑版）")
    parser.add_argument("json_file", help="JSON文件路径")
    parser.add_argument("--output", "-o", help="输出文件路径")
    parser.add_argument("--no-fix", action="store_true", help="只检测不修复")
    parser.add_argument("--report-only", action="store_true", help="只生成报告，不保存修复后的文件")
    parser.add_argument("--only-missing", action="store_true", help="只显示404/410链接")
    parser.add_argument("--export-missing", metavar="FILE", help="导出404/410链接到文件")
    parser.add_argument("--valid-status", type=int, action="append", help="额外视为有效的状态码（可多次使用）")
    parser.add_argument("--timeout", type=int, help="超时时间（秒）")
    parser.add_argument("--retries", type=int, help="重试次数")
    parser.add_argument("--concurrent", type=int, help="并发数（建议<=10）")
    parser.add_argument("--proxy", help="代理地址，例如 http://127.0.0.1:8080")
    parser.add_argument("--auto-build", action="store_true", help="修复后自动运行构建脚本")
    args = parser.parse_args()

    global REQUEST_TIMEOUT, RETRIES, MAX_CONCURRENT, PROXY, VALID_STATUS_CODES
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
    if args.valid_status:
        for code in args.valid_status:
            VALID_STATUS_CODES.add(code)
        print(f"额外有效状态码: {args.valid_status}")

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

    print("正在提取URL...")
    urls = extract_urls(original_data)
    print(f"找到 {len(urls)} 个URL。")
    if not urls:
        print("没有找到任何链接。")
        return

    print("开始检查链接有效性（低并发+随机延迟，避免封禁）...")
    results = asyncio.run(check_all_urls(urls))

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

    if args.output:
        output_file = args.output
    else:
        output_file = str(input_file).replace('.json', '_fixed.json')
        if output_file == str(input_file):
            output_file = str(input_file) + '_fixed.json'

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

    if args.auto_build:
        run_build()


if __name__ == "__main__":
    main()
