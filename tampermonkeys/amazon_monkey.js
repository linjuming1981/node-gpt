// ==UserScript==
// @name         amazon
// @namespace    http://tampermonkey.net/
// @version      2024-03-21
// @description  try to take over the world!
// @author       You
// @match        https://www.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://unpkg.com/vue@3.2.26/dist/vue.global.prod.js
// @require      file://D:\www\leb\node-gpt\classes/Amazon.js
// @require      file://D:\www\leb\node-gpt\tampermonkeys\App.js
// @require      file://D:\www\leb\node-gpt\tampermonkeys\amazon_monkey.js
// ==/UserScript==

// (async () => {
//   console.log(1111)
//   let amazon = new Amazon();
//   url = location.href 
//   let res
//   res = await amazon.getProductList(url)
//   proInfo = await amazon.collectDetail(res[0])
//   amazon.addProductsToSheet(proInfo)
// })();



(async () => {
  console.log(111)
  if (unsafeWindow.Vue === undefined) {
    unsafeWindow.Vue = Vue;
  }

  var el = document.createElement('div');
  document.body.appendChild(el);
  const { createApp } = Vue;
  createApp(App).mount(el)
})();