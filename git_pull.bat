@echo off  
title node-gpt
set INTERVAL=5

:Again  
echo git pull
git pull
timeout %INTERVAL%

goto Again