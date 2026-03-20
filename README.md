***这是什么网站？***
这是用于个人测试的导航网站，内置了网页生成node脚本，死链检测的py脚本。

作者：YOCIM
版本：V1.01
github链接：https://github.com/YOCIM888

# 如何使用这些script？还有py？

***常用命令见下文***

# 在script文件夹中打开命令

# bash；

# 根据
npm run build  为链接插入id

# 为链接卡片生成索引
node build-search.js 更新索引

# 根据模板生成子页面
node Subpage_Build.js --template 模板名.html --data 数据名.json --output 输出名.html

# 在py文件夹中打开命令

# bash：

# 基本用法：检测并自动修复
python check_fix_dead_links.py ../data/links.json

# 只检测不修复
python check_fix_dead_links.py ../data/links.json --no-fix

# 指定输出文件
python check_fix_dead_links.py ../data/links.json -o fixed.json

# 只生成报告，不保存文件
python check_fix_dead_links.py ../data/links.json --report-only

# 仅检测页面不存在的链接（404/410）
python check_fix_dead_links.py ../data/links.json --only-missing

# 导出缺失链接到文件
python check_fix_dead_links.py ../data/links.json --export-missing missing.txt

# 添加次数与超时
python check_fix_dead_links.py ../data/links.json --no-fix --timeout 30 --retries 3

# 添加允许的错误码
python check_fix_dead_links.py ../data/links.json --valid-status 400

# 在本地页面测试网站 根目录下

npx live-server




###### ***What is this website?***
This is a personal test navigation website with built-in Node.js scripts for webpage generation and Python scripts for dead link detection.
# Author: YOCIM
# Version: V1.01
# GitHub URL: https://github.com/YOCIM888

# How to use these scripts (Node.js & Python)?
# Common commands are listed below

# Run commands in the script folder
Bash:

***Insert IDs for links***
npm run build

***Generate index for link cards***
node build-search.js

***Update indexGenerate subpages from templates***
node Subpage_Build.js --template [template-name].html --data [data-name].json --output [output-name].html

# Run commands in the py folder
Bash:

***Basic usage: Detect and auto-fix dead links***
python check_fix_dead_links.py ../data/links.json

***Detect only (no auto-fix)***
python check_fix_dead_links.py ../data/links.json --no-fix

***Specify output file***
python check_fix_dead_links.py ../data/links.json -o fixed.json

***Generate report only (no file saving)***
python check_fix_dead_links.py ../data/links.json --report-only

***Detect only links with non-existent pages (404/410 errors)***
python check_fix_dead_links.py ../data/links.json --only-missing

***Export missing links to a file***
python check_fix_dead_links.py ../data/links.json --export-missing missing.txt

***Add timeout and retry parameters***
python check_fix_dead_links.py ../data/links.json --no-fix --timeout 30 --retries 3

***Add allowed error status codes***
python check_fix_dead_links.py ../data/links.json --valid-status 400

***Test the website on local pages (run in root directory)***
npx live-server