
class Amazon {
  constructor(){
    // 谷歌cloude shell接口连接
    // this.apiBaseUrl = 'https://8080-cs-ceb9bb12-1924-4701-ad3e-b0b3b2c6173d.cs-asia-southeast1-bool.cloudshell.dev'
    this.apiBaseUrl = 'https://8080-cs-239467590834-default.cs-asia-east1-vger.cloudshell.dev'
  }

  async getPageHtml(url){
    return new Promise(resolve => {
      $.ajax({
        url,
        success: (res) => {
          resolve(res)
        }
      })
    })
  }

  // 获取页面中所有产品连接
  async getProductList(url){
    let html = await this.getPageHtml(url)
    let $page = $(html)

    let regex = /^(https:\/\/www.amazon.com.*\/dp\/[A-Z0-9]+)[^A-Z0-9].*$/
    let productLinks = $page.find('a')
      .filter((i,n) => n.href.match(regex))
      .toArray()
      .map(n => n.href.replace(regex, '$1'))
    productLinks = Array.from(new Set(productLinks))

    let productIds = []
    let filterLinks = []
    productLinks.forEach(n => {
      let productId = n.match(/\/dp\/([^/]+)/)[1]; //B01N05APQY
      if(!productIds.includes(productId)){
        filterLinks.push(n)
        productIds.push(productId)
      }
    })

    console.log('productLinks', filterLinks)
    return filterLinks
  }

  async collectDetail(url){
    let html = await this.getPageHtml(url)
    // html = html.replace(/<script[^>]*[^/]?>[\s\S]*?<\/script>/g, '')
    // html = html.replace(/<style[^>]*[^/]?>[\s\S]*?<\/style>/g, '')
    html = html.replace(/<script>[\s\S]*?<\/script>/g, '')
    let $page = $(html)

    let productId = url.match(/\/dp\/([^/]+)/)[1]; //B01N05APQY

    // 标题
    let productTitle = $page.find('#productTitle').text().trim();
    if(!productTitle){
      return null
    }

    // 描述
    let productDescription = $page.find('#productDescription').text().trim()

    // 价格
    let cost = $page.find('#corePriceDisplay_desktop_feature_div .aok-offscreen').eq(0).text().trim()

    // 书籍描述（书籍类型才有）
    let bookDescription = $page.find('#bookDescription_feature_div').text().trim()
    
    // 功能清单
    let featurebullets = []
    $page.find('#featurebullets_feature_div li').each((i, n) => {
      featurebullets.push($(n).text().trim())
    })

    // 编辑评论
    let editorialReviews = $page.find('#editorialReviews-btf-ri_feature_div').text().trim()

    // 详情属性清单
    let detailBullets = []
    $page.find('#detailBullets_feature_div li').each((i, n) => {
      let text = $(n).text().trim().replace(/\s{2,}/g, '')
      detailBullets.push(text)
    })

    // 图片
    let fromStr = "'colorImages': "
    let fromI = html.indexOf(fromStr)
    if(fromI === -1) return null;

    let endI = html.indexOf("'colorToAsin':")
    let imgCode = html.slice(fromI + fromStr.length, endI).trim().replace(/,$/, '').replace(/'/g, '"')
    let imgs = JSON.parse(imgCode)
    imgs = imgs.initial.map(n => {
      return Object.keys(n.main)[0]
    })

    // 优点
    let aplus = []
    $page.find('#aplus_feature_div celwidget').each((i, n) => {
      let imgEl = $(n).find('img')[0]
      let img = imgEl?.src
      let imgDescription = $(n).text().trim() || imgEl?.alt
      let item = {
        img,
        imgDescription
      }
      aplus.push(item)
    })
    
    let res = {
      productId,
      productLink: url,
      productTitle,
      productDescription,
      featurebullets,
      detailBullets,
      imgs,
      cost,
      bookDescription,
      aplus,
      editorialReviews,
      markdownCode: '',
      htmlCode: '',
      postedToBlogger: 0,
    }
    console.log(res)
    return res
    
  }

  async addProductsToSheet(products){
    console.log('GM_xmlhttpRequest', products)
    GM_xmlhttpRequest({
      method: "POST", 
      url: `${this.apiBaseUrl}/addProductsToSheet`,
      data : JSON.stringify(products),
      headers: {"Content-Type": "application/json"},
      onload: function(response) {
        console.log('server back', response.responseText);
      }
    });
  }

}

// (async () => {
//   console.log(1111)
//   let amazon = new Amazon();
//   url = location.href
//   let res
//   res = await amazon.getProductList(url)
//   proInfo = await amazon.collectDetail(res[0])
//   amazon.addProductsToSheet(proInfo)
// })();