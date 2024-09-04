const template = `
  <div class="chatgpt_app">
    <button _onclick="toggleText">隐藏文字</button>
    <button _onclick="clearCache">清空缓存</button>
    <button _onclick="translate">开始翻译</button>
    <button _onclick="createImgPrompts">图片prompt</button>
    <button _onclick="stop">停止翻译</button>
  </div>
`

const role = `
你是一位专业的中英文学翻译家，专长于将中文小说翻译成英文。

**翻译要求：**

1. **准确性与完整性：**
   - 翻译必须与原文内容完全一致，不得省略任何情节或对话。

2. **可读性与表达：**
   - 确保翻译内容对英语读者易于理解。
   - 在保持原意和语气的基础上，使用生动且富有表现力的语言，以提升译文的文学品质。

3. **文化术语解释：**
   - 对于英语读者可能不熟悉的文化特定术语或概念，请在术语后用括号提供简短解释。

4. **格式保持：**
   - 保持原文中的任何格式，如段落分隔和对话结构。

5. **输出格式：**
   - 请直接输出翻译结果，翻译结果不要markdown代码编辑器输出，不附加任何额外的说明或信息。
`

const ChatgptApp = {
  template,
  data: {
    apiBaseUrl: 'https://node-gpt-h1b3.onrender.com',
    novels: [],
  },
  mounted(){  
    this.render(); 
    if(Store.get('isAutoTranslate')){
      this.translate()
    }
  },
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
  clearCache(){
    this.novels = [];
    Store.delete('novels');
    console.log('novels 缓存已清空');
  },
  async getNovelRows({refresh=false, filter=null, count=20}) {
    let novels = []
    if(!refresh){
      novels = Store.get('novels') 
      if(novels && novels.some(n => !n.enCont)){
        return novels
      }
    } 

    if(!filter){
      filter = {
        enCont: '',
        postedToBlogger: '0'
      }
    }

    let apiBaseUrl = this.data['apiBaseUrl']
    let res = await Util.request({
      url: `${apiBaseUrl}/getNovelRows`,
      method: 'post',
      data: {
        filter,
        count,
      }
    })
    novels = res?.data
    if(novels){
      Store.set('novels', novels)
    }

    return res.data
  },

  async setRole(){
    console.log('setRole');
    await Util.gptAsk(role)
  },

  toggleText(){
    const body = document.body
    if (body.classList.contains('body-hide-text')) {
      body.classList.remove('body-hide-text');
    } else {
      body.classList.add('body-hide-text');
    }
  },

  async translate(count=0) {
    if(count >= 5 ){
      Store.set('isAutoTranslate', true)
      await Util.refreshGptPage()
      return
    }
    this.isStop = false;
    Store.set('isAutoTranslate', false);
    console.log('translate start');
    if (!this.novels?.length) {
      this.novels = await this.getNovelRows()
    }

    let novel = this.novels.find(n => !n.enCont)
    if(!novel){
      GM_notification({
        title: '所有翻译任务已执行完毕',
        text: `所有翻译任务已执行完毕`,
        timeout: 5000,
        onclick: () => {
          unsafeWindow.focus(); // 并不一定能用 
        }
      })
      return;
    }

    if(this.isStop) return;

    let isTrue = await Util.gptAsk(`${role} \n\n你如果已经准备好，请回复“我已准备就绪”`)
    if(this.isStop || !isTrue) return;    

    let enTitle = await Util.gptAsk(`请翻译章节标题（输出格式示例"Chapter 16: Admitting Defeat"）：\n ${novel.cnTitle}`)
    if(!enTitle) return;
    enTitle = enTitle.replace('<p>', '').replace('</p>', '')

    const enContArr = []
    for(let i=0; i<novel.cnParts.length; i++){
      let cnPart = novel.cnParts[i]
      enPart = await Util.gptAsk(`请翻译以下章节片段： \n\n${cnPart}`)
      if(this.isStop || !enPart) return;   

      enContArr.push(enPart)
    }
    const enCont = enContArr.join('<br></br>')

    novel.enTitle = enTitle
    novel.enCont = enCont
    Store.set('novels', this.novels)

    if(this.isStop) return;    
    let apiBaseUrl = this.data['apiBaseUrl']
    const res = await Util.request({
      url: `${apiBaseUrl}/updateNovel`,
      method: 'post',
      data: {
        novel
      }
    })
    console.log('translate end', res);

    if(this.isStop) return;  

    // 翻译下一章节
    this.translate(count + 1);
  },

  // 生成摘要
  async createSubConts(count){
    if(count >= 5 ){
      Store.set('isAutoSubCont', true)
      await Util.refreshGptPage()
      return
    }
    this.isStop = false;
    Store.set('isAutoSubCont', false);
    console.log('createSubConts start');
    if (!this.novels?.length) {
      const filter = {subCont: ''}
      this.novels = await this.getNovelRows({filter});
    }

    let novel = this.novels.find(n => !n.subCont)
    if(!novel){
      GM_notification({
        title: '所有摘要subCont已执行完毕',
        text: `所有摘要subCont已执行完毕`,
        timeout: 5000,
        onclick: () => {
          unsafeWindow.focus(); // 并不一定能用 
        }
      })
      return;
    }
    if(this.isStop) return;

    let subCont = await Util.gptAsk(`你是一位才华横溢的小说家，我将提供一段小说章节内容。请从中提取最精彩、最吸引读者的连续部分，字数不超过300个字符，确保能激发读者的兴趣。只输出英文原文精华内容，无需任何额外解释。以下为章节内容：<br>${novel.cnCont}`)
    subCont = subCont.replace('<p>', '').replace('</p>', '')
    subCont = subCont.replace(/<strong>[^<]+<\/strong>/g, '')
    console.log(subCont);
    novel.subCont = subCont;
    Store.set('novels', this.novels)

    let apiBaseUrl = this.data['apiBaseUrl']
    const res = await Util.request({
      url: `${apiBaseUrl}/updateNovel`,
      method: 'post',
      data: {
        novel: {
          productId: novel.productId,
          subCont,
        }
      }
    })
    console.log('subCont生成end', res);

    // 翻译下一章节
    this.createSubConts(count + 1);
  },

  // 生产图片prompt
  async createImgPrompts(count){
    if(count >= 5 ){
      Store.set('isAutoImgPrompt', true)
      await Util.refreshGptPage()
      return
    }
    this.isStop = false;
    Store.set('isAutoImgPrompt', false);
    console.log('createImgPrompts start');
    if (!this.novels?.length) {
      const filter = {imgPrompt:''}
      this.novels = await this.getNovelRows({filter});
    }

    let novel = this.novels.find(n => !n.imgPrompt)
    if(!novel){
      GM_notification({
        title: '所有图片prompt任务已执行完毕',
        text: `所有图片prompt任务已执行完毕`,
        timeout: 5000,
        onclick: () => {
          unsafeWindow.focus(); // 并不一定能用 
        }
      })
      return;
    }
    if(this.isStop) return;

    const wordsCount = 100; // 多少个单词
    let imgPrompt = await Util.gptAsk(`你是一个专业的小说家，你精通Stable Diffusion图片prompt提示工程，请你根据我提供给你的以下小说章节内容，生成一个${wordsCount}个英文单词左右用于Stable Diffusion生成图片的英文prompt，请不要输出多余无关信息，只输出prompt。以下是我提供的小说章节内容：<br>${novel.cnCont}`)
    imgPrompt = imgPrompt.replace('<p>', '').replace('</p>', '')
    imgPrompt = imgPrompt.replace(/<strong>[^<]+<\/strong>/g, '')
    console.log(imgPrompt);
    novel.imgPrompt = imgPrompt;
    Store.set('novels', this.novels)

    let apiBaseUrl = this.data['apiBaseUrl']
    const res = await Util.request({
      url: `${apiBaseUrl}/updateNovel`,
      method: 'post',
      data: {
        novel: {
          productId: novel.productId,
          imgPrompt,
        }
      }
    })
    console.log('prompt生成end', res);

    // 翻译下一章节
    this.createImgPrompts(count + 1);

  },

  async stop(){
    this.isStop = true;
    await Util.gptStop()
  }
}

GM_addStyle(`
  .chatgpt_app:hover{
    width: auto;
    height: auto;
    opacity: 1;
  }
  .chatgpt_app {
    position: fixed;
    z-index: 1000;
    right: 0;
    top: 20%;
    width: 20px;
    height: 20px;
    overflow: hidden;
    opacity: 0.05;
  }
  .chatgpt_app button {
    display: block;
    border: 1px solid #253a49;
    margin-top: -1px;
    background-color: #11191f;
    color: #fff;
    font-size: 12px;
    padding: 3px 5px;
  }
  .chatgpt_app button:hover {
    background-color: #388e3c;
  }
  .chatgpt_app button:active {
    background-color: #005a30; 
    transform: scale(0.98);
  }
  .body-hide-text .text-token-text-primary[data-testid^="conversation-turn-"] {
    display: none;
  }
`)

ChatgptApp.mounted();
unsafeWindow.ChatgptApp = ChatgptApp;