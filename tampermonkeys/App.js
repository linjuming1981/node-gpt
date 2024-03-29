const template = `
  <div class="amazon_app">
    <button type="primary" @click="addProductsToSheet">收集</button>
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
      
      // let products = [{
      //   productId: 'kkkk',
      //   productTitle: 'title',
      //   productDescription: 'kk desc',
      //   cost: 11,
      //   bookDescription: 'bookDescription',
      //   featurebullets: 'featurebullets',
      //   editorialReviews: 'editorialReviews',
      //   detailBullets: 'detailBullets',
      //   imgs: 'imgs',
      // }]
      
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
