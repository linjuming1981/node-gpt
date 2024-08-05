const template = `
  <div class="chatgpt_app">
    <button _onclick="setRole">角色设定</button>
    <button _onclick="translate">翻译一章</button>
    <button _onclick="clearCache">清空缓存</button>
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
   - 请直接输出翻译结果，翻译结果不要markdown代码编辑器输出，章节标题用h2标签输出，格式如"Chapter 24: The Divine Weapon"，不附加任何额外的说明或信息。
`

const ChatgptApp = {
  template,
  data: {
    apiBaseUrl: 'https://node-gpt-h1b3.onrender.com',
    // apiBaseUrl: 'https://8080-cs-239467590834-default.cs-asia-southeast1-ajrg.cloudshell.dev',
    novels: [],
  },
  mounted(){  
    this.render(); 
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
    Store.delete('novels');
    console.log('novels 缓存已清空');
  },
  async getNovelRows(refresh=false) {
    let novels = []
    if(!refresh){
      novels = Store.get('novels') 
      if(novels && novels.some(n => !n.enCont)){
        return novels
      }
    } 

    let apiBaseUrl = this.data['apiBaseUrl']
    let res = await Util.request({
      url: `${apiBaseUrl}/getNovelRows`,
      method: 'post',
      data: {
        filter: {
          enCont: '',
          postedToBlogger: '0'
        },
        count: 10,
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

  async translate() {
    console.log('translate start');
    if (!this.novels) {
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

    Util.getAsk(role)
    const enTitle = await Util.getAsk(`请翻译章节标题： ${novel.title}`)
    const enContArr = []
    for(let i=0; i<novel.cnParts.length; i++){
      let cnPart = novel.cnParts[i]
      enPart = await Util.getAsk(`请翻译以下章节片段： \n\n${cnPart}`)
      enContArr.push(enPart)
    }
    const enCont = enContArr.join('<br></br>')

    // let cnSection = `# ${novel.cnTitle} \n\n${novel.cnCont}`
    // let askCont = `${role} \n\n 下面是你要翻译的章节内容： \n\n ${cnSection}`
    // let enHtml = await Util.gptAsk(askCont)
    // if(!enHtml){
    //   console.log('翻译出错，请重试');

    //   GM_notification({
    //     title: '翻译任务出错中断',
    //     text: `翻译任务出错中断`,
    //     timeout: 5000,
    //     onclick: () => {
    //       unsafeWindow.focus(); // 并不一定能用 
    //     }
    //   })

    //   return;
    // }

    // let enTitle = ''
    // let enCont = enHtml.replace(/^<h2>(.*)<\/h2>/, (s, s1) => {
    //   enTitle = s1
    //   return ''
    // })

    novel.enTitle = enTitle
    novel.enCont = enCont
    Store.set('novels', this.novels)

    let apiBaseUrl = this.data['apiBaseUrl']
    const res = await Util.request({
      url: `${apiBaseUrl}/updateNovel`,
      method: 'post',
      data: {
        novel
      }
    })
    console.log('translate end', res);

    // 翻译下一章节
    this.translate();
  }
}

GM_addStyle(`
  .chatgpt_app {
    position: fixed;
    z-index: 1000;
    right: 0;
    top: 20%;
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
`)

ChatgptApp.mounted();
unsafeWindow.ChatgptApp = ChatgptApp;