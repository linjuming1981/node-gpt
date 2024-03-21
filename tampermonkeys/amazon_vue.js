GM_addStyle(`
  /* 这里添加你自定义的 CSS 样式 */
  .el-button {
    margin: 5px;
  }
`);

(function () {
  console.log(111)
  if (unsafeWindow.Vue === undefined) {
    unsafeWindow.Vue = Vue;
  }

  var el = document.createElement('div');
  document.body.appendChild(el);
  const { createApp } = Vue;

  var App = {
    data: function() {
      return {
        count: 0
      };
    },
    methods: {
      increment: function() {
        this.count++;
      }
    },
    template: `
      <div>
          <button type="primary" @click="increment">点击我</button>
          <p>点击了 {{ count }} 次</p>
      </div>
    `
  };

  createApp(App).mount(el);

})();