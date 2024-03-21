const template = `
  <div class="amazon_app">
    <button type="primary" @click="addProductToSheet">收集</button>
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
    async addProductToSheet(){
      let amazon = new Amazon()
      let url = location.href
      let productUrls = await amazon.getProductList(url)
      console.log('products', productUrls)
      proInfo = await amazon.collectDetail(productUrls[0])
      let res = await amazon.addProductsToSheet(products)
      return res
    }
  }
}

GM_addStyle(`
  .amazon_app {
    position: fixed;
    z-index: 1000;
    right: 0;
    top: 20%;
  }
`);

unsafeWindow.App = App;
