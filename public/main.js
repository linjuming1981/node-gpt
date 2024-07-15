const { loadModule } = window['vue3-sfc-loader'];

// 配置
const options = {
  moduleCache: {
    vue: Vue
  },

  async getFile(url) {
    const res = await fetch(url);
    if ( !res.ok ){
      throw Object.assign(new Error(res.statusText + ' ' + url), { res });
    }
    return {
      getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
    }
  },

  addStyle(textContent) {
    const style = Object.assign(document.createElement('style'), { textContent });
    const ref = document.head.getElementsByTagName('style')[0] || null;
    document.head.insertBefore(style, ref);
  },
}

// 渲染
const app = Vue.createApp({
  components: {
    Home: Vue.defineAsyncComponent( () => loadModule('./components/home/index.vue', options) ),
    Amazon: Vue.defineAsyncComponent( () => loadModule('./components/amazon/index.vue', options) ),
    Novel: Vue.defineAsyncComponent( () => loadModule('./components/novel/index.vue', options) ),
  },
  template: `
    <Home>
      <template #amazon><Amazon /></template>
      <template #novel><Novel /></template>
    </Home>
  `
});

app.use(ElementPlus)
app.mount('#app');