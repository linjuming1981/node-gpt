#!/bin/bash

# 初始化变量
PWD=$(pwd)
GIT_REPO_PATH="/home/linjuming1981/node-gpt"
NODE_SERVER_PATH="/home/linjuming1981/node-gpt"
SERVER_SCRIPT="server_start.js" # 你的 Node Express 脚本
CHECK_INTERVAL=30 # 检测间隔时间（秒）

# 切换到你的 Git 仓库
# cd $GIT_REPO_PATH

# 开始循环检测
while true
do
  # 拉取最新的代码
  git fetch

  # 检查是否有更新
  if [ "$(git rev-parse HEAD)" != "$(git rev-parse @{u})" ]
  then
    echo "New commits detected, updating the repo."

    # 更新仓库
    git pull

    # 如果 Node 服务正在运行，停止它
    if pgrep -x "node" > /dev/null
    then
      echo "Stopping Node server."
      pkill node
    fi

    # 切换到你的 Node 服务目录并启动服务
    cd $NODE_SERVER_PATH
    echo "Starting Node server."
    node $SERVER_SCRIPT &

    # 切换回 Git 仓库目录以继续检测
    cd $GIT_REPO_PATH
  fi

  # 等待一段时间后再进行下一次检测
  sleep $CHECK_INTERVAL
done