#!/bin/bash

git fetch
echo "git auto pull"

# 初始化变量
PWD=$(pwd)
# GIT_REPO_PATH="/home/linjuming1981/node-gpt"
# NODE_SERVER_PATH="/home/linjuming1981/node-gpt"
GIT_REPO_PATH=$(pwd)
NODE_SERVER_PATH=$(pwd)
SERVER_SCRIPT="server_start.js" # 你的 Node Express 脚本
CHECK_INTERVAL=30 # 检测间隔时间（秒）

# 切换到你的 Git 仓库
# cd $GIT_REPO_PATH

# 开始循环检测
while true
do
  echo "hello world"

  # 拉取最新的代码
  git fetch

  # 检查是否有更新
  if [ "$(git rev-parse HEAD)" != "$(git rev-parse @{u})" ]
  then
    # echo "New commits detected, updating the repo."
    echo "有新提交, 正在执行git pull"

    # 更新仓库
    git pull

    # 切换回 Git 仓库目录以继续检测
    cd $GIT_REPO_PATH
  fi

  # 等待一段时间后再进行下一次检测
  sleep $CHECK_INTERVAL
done