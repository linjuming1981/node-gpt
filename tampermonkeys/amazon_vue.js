GM_addStyle(`
  /* 这里添加你自定义的 CSS 样式 */
  .el-button {
    margin: 5px;
  }
`);

(function () {
  console.log(111)
  //等待页面加载
  window.addEventListener('load', () => {
    var el = document.createElement('div');
    document.body.appendChild(el);

    const { createApp, reactive } = Vue;
    const { ElButton } = ElementPlus;

    const App = {
      components: {
        ElButton
      },
      setup() {
        const state = reactive({
          count: 0
        });

        function increment() {
          state.count++;
        }

        return { state, increment };
      },
      template: `
        <div>
            <el-button type="primary" @click="increment">点击我</el-button>
            <p>点击了 {{ state.count }} 次</p>
        </div>
    `,
    };

    createApp(App).mount(el);
  });
})();