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
    // Amazon: Vue.defineAsyncComponent( () => loadModule('./components/amazon/index.vue', options) ),
    Novel: Vue.defineAsyncComponent( () => loadModule('./components/novel/index.vue', options) ),
    ImgCreator: Vue.defineAsyncComponent( () => loadModule('./components/imgCreator/index.vue', options) ),
    TwitterTrends: Vue.defineAsyncComponent( () => loadModule('./components/twitterTrends/index.vue', options) ),
  },
  template: `
    <Home>
      <template #novel><Novel /></template>
      <template #imgCreator><ImgCreator /></template>
      <template #twitterTrends><TwitterTrends /></template>
    </Home>
  `
});

app.use(ElementPlus)
app.mount('#app');