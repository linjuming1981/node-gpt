// ==UserScript==
// @name         huggingface
// @namespace    http://tampermonkey.net/
// @version      2024-09-24
// @description  try to take over the world!
// @author       You
// @match        https://huggingface.co/spaces/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huggingface.co
// @require      file://D:\www\leb\node-gpt\tampermonkeys\huggingface_monkey.js
// @grant        unsafeWindow
// ==/UserScript==    


const HuggingFaceMonkey = {
  template: `   
    <div class="huggingface_monkey">
      <div class="actions">
        <span _onclick="addActionBtns">跳转</span>
      </div>
    </div>
  `,

  jumpIframe(){
    let url = document.querySelector('#iFrameResizer0')?.src
    if(!url){
      setTimeout(HuggingFaceMonkey.jumpIframe, 500)
      return
    }
    location.href = url
  }
}

HuggingFaceMonkey.jumpIframe()
unsafeWindow.HuggingFaceMonkey = HuggingFaceMonkey


