# 1. 【可选但推荐】备份整个仓库（包括 .git）
cp -r .git /tmp/backup-git-$(date +%Y%m%d)

# 2. 创建孤儿分支（命名随意，这里叫 fresh）
git checkout --orphan fresh

# 3. 查看状态，确认当前是空的工作区（非必要，了解即可）
git status   # 应该显示 "Initial commit" 且没有文件

# 4. 添加当前项目的所有文件（注意：会包含 .gitignore 中忽略的文件吗？不会，add -A 会尊重 .gitignore）
git add -A

# 5. 提交为全新的根提交
git commit -m "Initial commit (squashed entire history)"

# 6. 删除旧的主分支（假设叫 main，如果是 master 则改命令）
git branch -D main

# 7. 把当前孤儿分支改名为 main
git branch -m main

# 8. 【如果之前推送过远程】强制覆盖远程仓库
git push -f origin main

# 9. 彻底清理本地残留对象
git reflog expire --expire=now --all
git gc --aggressive --prune=now