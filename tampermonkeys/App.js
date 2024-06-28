const template = `
  <div class="amazon_app">
    <button type="primary" @click="addOneToSheet">收集one</button>
    <button type="primary" @click="addProductsToSheet">收集all</button>
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
    async addOneToSheet(){
      let amazon = new Amazon()
      let url = location.href
      let product = await amazon.collectDetail(url)
      console.log('product', product)
      let res = await amazon.addProductsToSheet([product])
      return res
    },

    async addProductsToSheet(){  
      let amazon = new Amazon()
      let url = location.href
      let productUrls = await amazon.getProductList(url)
      let ps = productUrls.map(n => {
        return amazon.collectDetail(n)
      })
      
      let products = []
      try {
        products = await Promise.all(ps)
      } catch (err) {
        console.error('An error occurred:', err)
      }
      products = products.filter(n => n)

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
  .amazon_app button{
    display: block;
  }
`);

unsafeWindow.App = App;
