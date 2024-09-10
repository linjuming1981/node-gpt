// ==UserScript==
// @name         chatgpt
// @namespace    http://tampermonkey.net/
// @version      2024-08-01
// @description  try to take over the world!
// @author       You
// @match        https://chatgpt.com
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      file://D:\www\leb\node-gpt\classes\Util.js
// @require      file://D:\www\leb\node-gpt\classes\Store.js
// @require      file://D:\www\leb\node-gpt\tampermonkeys\chatgpt\ChatgptApp.js
// @require      file://D:\www\leb\node-gpt\tampermonkeys\chatgpt_monkey.js
// ==/UserScript==

GM_addStyle(`
  /* 隐藏左上角chatgpt切换 */
  [aria-haspopup="menu"]{
    font-size: 0;
  }

  /* 隐藏升级plus弹窗 */
  .absolute.bottom-full{
    display: none;
  }

  /* 隐藏输入框提示 */
  #prompt-textarea::placeholder{
    visibility: hidden;
  }

  /* 隐藏底部chatgpt小字 */
  .relative.px-2.py-2.text-center.text-xs.text-token-text-secondary>span{
    display: none;
  }

  /*chat.notdiamond.ai 样式*/
  body>div>div[class*="dark"]{
    width: 10px;
    padding: 0;
  }
  body>div>div[class*="dark"]:hover {
    width: 200px;
  }

  body>div>div[class*="dark"] .max-h-screen button{
    margin: 10px;
  }


`)
