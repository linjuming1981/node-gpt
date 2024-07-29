const template = `
  <div class="chatgpt_app">
    <button @click="setRole">角色设定</button>
    <button @click="translate">翻译一章</button>
  </div>
`
  
const ChatgptApp = {
  template,
  data(){
    return {
      apiBaseUrl: 'https://node-gpt-h1b3.onrender.com',
      novels: [],
    }  
  },
  methods: { 
    async getNovelRows(){
      let novels = await Util.request({
        url: `${this.apiBaseUrl}/getNovelRows`,
        method: 'post',
        data: {
          filter: {
            enCont: '',
            postedToBlogger: '0'
          },
          count: 10,
        }
      })
      return novels;
    },

    async translate(){
      if(!this.novels){
        this.novels = await this.getNovelRows()
      }
      let novel = this.novels.find(n => !n.isTranslated)
      

    }
  }
}