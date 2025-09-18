#!/bin/bash

# 版本更新脚本 - 自动更新Git提交号到代码中
# 使用方法: ./update-version.sh

# 获取当前Git提交号（前7位）
COMMIT_HASH=$(git rev-parse --short HEAD)

echo "Updating version to include commit hash: $COMMIT_HASH"

# 更新JavaScript文件中的提交号
sed -i.bak "s/const GIT_COMMIT = '[a-f0-9]*';/const GIT_COMMIT = '$COMMIT_HASH';/g" script.js

# 清理备份文件
rm -f script.js.bak

echo "Version updated successfully!"
echo "New version: v0.1($COMMIT_HASH)"