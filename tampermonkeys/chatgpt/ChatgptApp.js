const template = `
  <div class="chatgpt_app">
    <button _onclick="setRole">角色设定</button>
    <button _onclick="translate">翻译一章</button>
  </div>
`

const ChatgptApp = {
  template,
  data: {
    apiBaseUrl: 'https://node-gpt-h1b3.onrender.com',
    novels: [],
  },
  mounted(){  
    this.render();      // 11112
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
  async getNovelRows() {
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
    return res.data
  },

  async translate() {
    if (!this.novels) {
      this.novels = await this.getNovelRows()
    }
    let novel = this.novels.find(n => !n.isTranslated)
    let res = await Util.request({
      url: `http://localhost:9000/gptFillQuery`,
      method: 'post',
      data: {
        text: novel.cnCont
      }
    })
    console.log(res)
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
`)

ChatgptApp.mounted();
unsafeWindow.ChatgptApp = ChatgptApp;