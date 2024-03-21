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
      let products = []
      productUrls.forEach(async url => {
        const proInfo = await amazon.collectDetail(url)
        products.push(proInfo)
      })
      console.log('productsUrls', productUrls)
      console.log('products', products)
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
