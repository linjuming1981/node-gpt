const template = `
  <div>
    <button type="primary" @click="increment">点击我</button>
    <p>点击了 {{ count }} 次</p>
  </div>
`
const App = {
  template,
  data(){
    return {
      count: 0,
    }
  },
  methods: {
    increment: function() {
      this.count++;
    }
  }
}

GM_addStyle(`
  /* 这里添加你自定义的 CSS 样式 */
  .el-button {
    margin: 5px;
  }
`);

unsafeWindow.App = App;
