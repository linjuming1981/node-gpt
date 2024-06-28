
class Amazon {
  constructor(){
    // 谷歌cloude shell接口连接
    // this.apiBaseUrl = 'https://8080-cs-239467590834-default.cs-us-west1-wolo.cloudshell.dev'
    this.apiBaseUrl = 'https://node-gpt-h1b3.onrender.com'
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

  getPageItemUrl(inputURL) {
    let match = inputURL.match(/&url=([^&]+)%2Fref%3D/);
    let decodedMatch = match ? decodeURIComponent(match[1]) : '';
    let fullyDecoded = decodeURIComponent(decodedMatch);
    return 'https://www.amazon.com' + fullyDecoded;
  }

  // 获取页面中所有产品连接
  async getProductList(url, page=null){
    let html = await this.getPageHtml(url)
    let $page = $(html)

    let productLinks = []
    if(!page){
      let regex = /^(https:\/\/www.amazon.com.*\/dp\/[A-Z0-9]+)[^A-Z0-9].*$/
      let productLinks = $page.find('a')
      .filter((i,n) => n.href.match(regex))
      .toArray()
      .map(n => n.href.replace(regex, '$1'))
      productLinks = Array.from(new Set(productLinks))
    }

    if(page === 'list'){
      $page.find('.s-result-list').find('.s-result-item').each((i,n) => {
        let url = $(n).find('a').attr('href')
        if(!url){
          return true
        }
        url = this.getPageItemUrl(url)
        productLinks.push(url)
      })
    }

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
    let oHtml = await this.getPageHtml(url)
    let html = oHtml.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')
    let $page = $(html)
    $page.find('style').remove()
    $page.find('script').remove()

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

    // 预览小图片
    let fromStr = "'colorImages': "
    let fromI = oHtml.indexOf(fromStr)
    if(fromI === -1) return null;

    let endI = oHtml.indexOf("'colorToAsin':")
    let imgCode = oHtml.slice(fromI + fromStr.length, endI).trim().replace(/,$/, '').replace(/'/g, '"')
    let previewImgs = JSON.parse(imgCode)
    previewImgs = previewImgs.initial.map(n => {
      return Object.keys(n.main)[0]
    })

    // 产品描述图片
    let detailImgs = this.getDetailImgs($page)

    // 视频描述图片
    let videoImgs = []
    $page.find('h4._vse-vw-dp-card_style_vseVideoTitleText__1lJWI').each((i, n) => {
      let $box = $(n).closest('[data-elementid=vse-cards-video-thumbnail]')
      const imgUrl = $box.find('img').attr('data-src')
      const imgDesc = $(n).text()
      videoImgs.push({imgUrl, imgDesc})
    })

    let res = {
      productId,
      productLink: url,
      productTitle,
      productDescription,
      featurebullets,
      detailBullets,
      previewImgs,
      detailImgs,
      videoImgs,
      cost,
      bookDescription,
      editorialReviews,
      markdownCode: '',
      htmlCode: '',
      postedToBlogger: 0,
    }
    return res
    
  }

  getImgUrl(el){
    let imgUrl = $(el).attr('data-src') || $(el).attr('src')
    return imgUrl
  }

  // 获取产品描述图片
  getDetailImgs($page){
    let contBoxes = ['#aplus_feature_div']
    
    let results = [];
    contBoxes.forEach(n => {
      let $boxEl = $page.find(n)
      $boxEl.find('img').each((i, n) => {
        let $img = $(n);
        let $currElement = $img.parent();
        let layerCount = 0;
        let imgUrl = this.getImgUrl(n)
        // https://m.media-amazon.com/images/S/aplus-media-library-service-media/a0037239-36de-491b-babd-f1aae297f746.__CR0,0,970,600_PT0_SX970_V1___.jpg
        let imgWidth = imgUrl.match(/_PT0_SX(\d+)_/)?.[1]*1
        if(!imgWidth){
          return true;
        }
        
        while ($currElement.length > 0 && layerCount < 5) {
          // 如果父元素包含其他图片，停止寻找
          if($currElement.find('img').toArray().filter(n1 => this.getImgUrl(n1).includes('_PT0_SX')).length > 1) {
            results.push({
              imgWidth,
              imgUrl,
              description: $img.attr('alt'),
            });
            break;
          }
          
          // 获取纯文本内容并去除所有空格和换行
          let textContent = $currElement
            .text()
            .replace(/<img[^\>]+\/>/g, '')
            .replace(/\n/g, '')
            .replace(/ +/g, ' ').trim();
          
          if (textContent !== '') {
            results.push({
              imgWidth,
              imgUrl,
              description: textContent
            });
            break;
          }
          
          // 移动到上一级父元素并更新层数
          $currElement = $currElement.parent();
          layerCount++;
        }
      });
    });
    
    return results
  }


  async addProductsToSheet(products){
    console.log('GM_xmlhttpRequest', products)
    GM_xmlhttpRequest({
      method: "POST", 
      url: `${this.apiBaseUrl}/addProductsToSheet`,
      data : JSON.stringify(products),
      headers: {"Content-Type": "application/json"},
      onload: function(response) {
        console.log('server back', response);
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