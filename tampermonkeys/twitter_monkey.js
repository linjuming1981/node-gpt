// ==UserScript==
// @name         Twitter
// @namespace    http://tampermonkey.net/
// @version      2024-09-11
// @description  try to take over the world!
// @author       You
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      file://D:\www\leb\node-gpt\tampermonkeys\twitter.monkey.js
// ==/UserScript==


const TwitterMonkey = {

  // 收集页面ajax请求
  collectAjaxs() {
    unsafeWindow.ajaxs = {};

    let RealXMLHttpRequest = unsafeWindow.XMLHttpRequest;
    unsafeWindow.XMLHttpRequest = function() {
      let xhr = new RealXMLHttpRequest();

      // 监听发起的 XMLHttpRequest 请求
      xhr.addEventListener("load", function() {
        unsafeWindow.ajaxs[this.responseURL] = {
          url: this.responseURL,
          response: this.response,
        };
      });

      return xhr;
    };
  },

  dropdownMenu: null,
  hideTimeout: null,
  currentUrl: null,  // 保存当前 URL

  // 创建下拉菜单的容器
  createDropdownMenu() {
    let dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'twitter-monkey-dropdown-menu';
    dropdownMenu.style.display = 'none';
    dropdownMenu.style.position = 'fixed';
    dropdownMenu.style.backgroundColor = '#fff';
    dropdownMenu.style.border = '1px solid #ddd';
    dropdownMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    dropdownMenu.style.zIndex = '1000';
    dropdownMenu.style.maxWidth = '200px'; // 可以根据需要调整

    // 创建评论按钮
    let replyBtn = document.createElement('div');
    replyBtn.textContent = '评论';
    replyBtn.className = 'twitter-monkey-reply-btn';
    replyBtn.style.cursor = 'pointer';
    replyBtn.style.padding = '5px 10px';
    replyBtn.style.borderBottom = '1px solid #ddd';

    // 点击评论按钮时调用回复函数
    replyBtn.onclick = () => {
      if (this.currentUrl) {
        this.reply(this.currentUrl);
      } else {
        alert('没有可用的 URL');
      }
    };

    // 添加评论按钮到下拉菜单
    dropdownMenu.appendChild(replyBtn);

    // 添加下拉菜单到 body
    document.body.appendChild(dropdownMenu);

    return dropdownMenu;
  },

  // 给每个帖子后面添加操作按钮和下拉菜单
  addActionBtns() {
    let els = document.querySelectorAll('time');
    if (!location.href.includes('search?q')) {
      return;
    }

    if (!els.length) {
      setTimeout(() => {
        this.addActionBtns();
      }, 3000);
      return;
    }

    // 创建下拉菜单容器
    this.dropdownMenu = this.createDropdownMenu();

    els.forEach(el => {
      let parentAnchor = el.closest('a');
      if (parentAnchor && (!parentAnchor.nextSibling || parentAnchor.nextSibling.className !== 'twitter-monkey-action-btn')) {
        // 创建操作按钮
        let actionBtn = document.createElement('span');
        actionBtn.textContent = '操作';
        actionBtn.className = 'twitter-monkey-action-btn';
        actionBtn.style.cursor = 'pointer';
        actionBtn.style.marginLeft = '10px';
        actionBtn.style.position = 'relative';

        // 设置操作按钮的鼠标事件
        actionBtn.onmouseenter = (event) => {
          // 设置下拉菜单的位置
          this.dropdownMenu.style.display = 'block';
          this.dropdownMenu.style.top = `${event.clientY + 10}px`; // 让菜单显示在鼠标下方
          this.dropdownMenu.style.left = `${event.clientX}px`; // 让菜单显示在鼠标右侧

          // 保存当前 URL
          this.currentUrl = parentAnchor.href;

          // 清除隐藏定时器（如果存在）
          clearTimeout(this.hideTimeout);
        };

        actionBtn.onmouseleave = () => {
          // 设置延迟隐藏菜单
          this.hideTimeout = setTimeout(() => {
            this.dropdownMenu.style.display = 'none';
          }, 300); // 延迟300ms后隐藏菜单
        };

        // 处理下拉菜单的鼠标事件
        this.dropdownMenu.onmouseenter = () => {
          // 清除隐藏定时器
          clearTimeout(this.hideTimeout);
          this.dropdownMenu.style.display = 'block'; // 保持菜单显示
        };

        this.dropdownMenu.onmouseleave = () => {
          // 延迟隐藏菜单
          this.hideTimeout = setTimeout(() => {
            this.dropdownMenu.style.display = 'none';
          }, 300); // 延迟300ms后隐藏菜单
        };

        // 将操作按钮添加到 a 标签之后
        parentAnchor.parentNode.insertBefore(actionBtn, parentAnchor.nextSibling);
      }
    });
  },

  // 模拟回复功能（这里需要你实现具体的回复逻辑）
  reply(url) {
    console.log(url)
  }
};

// 初始化
TwitterMonkey.collectAjaxs();
setTimeout(() => {
  TwitterMonkey.addActionBtns();
}, 3000);

// 添加 CSS 样式
GM_addStyle(`
  /* 操作按钮的样式 */
  .twitter-monkey-action-btn {
    cursor: pointer;
    margin-left: 10px;
    position: relative;
  }

  /* 下拉菜单的样式 */
  .twitter-monkey-dropdown-menu {
    display: none;
    position: fixed;
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 1000;
  }

  /* 评论按钮的样式 */
  .twitter-monkey-reply-btn {
    cursor: pointer;
    padding: 5px 10px;
    border-bottom: 1px solid #ddd;
    color: #222;
  }
`);
