// ==UserScript==
// @name         chatgpt
// @namespace    http://tampermonkey.net/
// @version      2024-8-1
// @description  try to take over the world!
// @author       You
// @match        https://chagtgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://unpkg.com/vue@3.2.26/dist/vue.global.prod.js
// @require      file://D:\www\leb\node-gpt\tampermonkeys\chatgpt\ChatgptApp.js
// @require      file://D:\www\leb\node-gpt\tampermonkeys\chatgpt_monkey.js
// ==/UserScript==

// (async () => {
//   console.log(111)
//   if (unsafeWindow.Vue === undefined) {
//     unsafeWindow.Vue = Vue;
//   }

//   var el = document.createElement('div');
//   document.body.appendChild(el);
//   const { createApp } = Vue;
//   createApp(ChatgptApp).mount(el)
// })();