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
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      file://D:\www\leb\node-gpt\classes\Util.js
// @require      file://D:\www\leb\node-gpt\classes\Store.js
// @require      file://D:\www\leb\node-gpt\tampermonkeys\twitter_monkey.js
// ==/UserScript==


const TwitterMonkey = {

  template: `
    <div class="twitter_monkey">
      <div class="actions">
        <span _onclick="addActionBtns">评论</span>
      </div>
    </div>
  `,

  apiBaseUrl: 'https://node-gpt-h1b3.onrender.com',
  dropdownMenu: null,
  hideTimeout: null,
  currentUrl: null,  // 保存当前 URL

  render(){
    var el = document.createElement('div');
    el.innerHTML = this.template
    document.body.appendChild(el)
    el.addEventListener('click', e => {
      let evt = e.target.getAttribute('_onclick')
      if(evt){
        this[evt]()
      }      
    })
  },

  // 收集页面ajax请求
  collectAjaxs() {
    unsafeWindow.ajaxs = {};

    let RealXMLHttpRequest = unsafeWindow.XMLHttpRequest;
    unsafeWindow.XMLHttpRequest = function() {
      let xhr = new RealXMLHttpRequest();

      // 监听发起的 XMLHttpRequest 请求
      xhr.addEventListener("load", function() {
        const whiteList = ['SearchTimeline', 'HomeTimeline']
        if(whiteList.some(n => this.responseURL.includes(n))){
          unsafeWindow.ajaxs[this.responseURL] = {
            url: this.responseURL,
            response: this.response,
          };
        }
      });

      return xhr;
    };
  },

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
  async reply(url) {
    // 帖子详情网址： https://x.com/linjuming_1/status/1833768406891548829
    console.log(url)
    const regex = /status\/(\d+)/;
    const postId = url.match(regex)[1];
    let post
    let allPosts = []

    for(let i in unsafeWindow.ajaxs){
      // 搜索路径
      // temp1.data.search_by_raw_query.search_timeline.timeline.instructions[0].entries[3].content.itemContent.tweet_results.result.legacy.full_text
      if(i.includes('SearchTimeline')){
        let res = JSON.parse(unsafeWindow.ajaxs[i].response)
        let posts = res.data.search_by_raw_query.search_timeline.timeline.instructions[0].entries // 帖子列表
        allPosts = [...posts, ...allPosts]
      }

      // 首页路径
      // data.home.home_timeline_urt.instructions[0].entries[1].content.itemContent.tweet_results.result.legacy.full_text
      if(i.includes('HomeTimeline')){
        let res = JSON.parse(unsafeWindow.ajaxs[i].response)
        let posts = res.data.home.home_timeline_urt.instructions[0].entries // 帖子列表
        allPosts = [...posts, ...allPosts]
      }

      allPosts = allPosts.filter(n => n?.content?.__typename === "TimelineTimelineItem")
      allPosts = allPosts.map(n => {
        if(n.content?.itemContent?.tweet_results?.result?.legacy){
          return n.content.itemContent.tweet_results.result.legacy
        } else {
          return {}
        }
      })
      post = allPosts.find(n => n.id_str === postId)
     
    }
    console.log('post', post);

    let res = await Util.gptAsk(`
      ## 角色和能力：
      - 1. 你是个画家，你想象力很丰富，可以根据我提供的帖子内容脑补生成画面，并且你精通stable diffunion prompt工程。
      - 2. 同时你也是个英文幽默大师，你会根据我提供的帖子内容，输出幽默有趣的英文回复内容。
      ## 要求：
      - 1. 请你根据我提供的内容生成一个100个单词左右的英文prompt。
      - 2. 请你根据我提供的内容生成一个270个字符左右的英文回复内容。
      ## 输入：
      - 1. 帖子内容会用"""<帖子内容>"""（三引号进行包裹）
      ## 输出格式：
      - 1. 要用json格式输出内容，不要嵌套在markdown编辑器内，不要用代码编辑器（代码高亮着色）输出，要直接输出，不附加任何额外的说明或信息。
      - 2. 格式示例如: {"replyCont": "<英文回复内容>","imgPrompt":"<英文prompt>"}
      ## 我提供的帖子内容如下："""\n${post.full_text}\n"""
    `, 'text')
    console.log('gpt reply res', res);
    const {replyCont, imgPrompt} = JSON.parse(res)

    const ret = await Util.request({
      url: `${this.apiBaseUrl}/twitterAiReply`,
      method: 'post',
      data: {
        postId,
        postCont: post.full_text,
        replyCont,
        imgPrompt,
      }
    })
    console.log('reply', ret);
  }
};

// 初始化
TwitterMonkey.collectAjaxs();
TwitterMonkey.render();
unsafeWindow.TwitterMonkey = TwitterMonkey

// 添加 CSS 样式
GM_addStyle(`
  .twitter_monkey{
    position: fixed;
    right: 0;
    top: 50%;
  }
  .twitter_monkey .actions span{
    background-color: #005f34;
    border: 1px solid #11633e;
    cursor: pointer;
    font-size: 12px;
    padding: 2px 4px;
  }
  .twitter_monkey .actions span:active{
    background-color: #00a05e; /* 点击时的高亮颜色 */
    border-color: #149e60;
  }

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
