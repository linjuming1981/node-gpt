// ==UserScript==
// @name         amazon
// @namespace    http://tampermonkey.net/
// @version      2024-03-21
// @description  try to take over the world!
// @author       You
// @match        https://www.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://unpkg.com/vue@3.2.26/dist/vue.global.prod.js
// @require      https://unpkg.com/element-plus@1.2.0-beta.4/lib/index.full.js
// @require      file://D:\www\leb\node-gpt\tampermonkeys\amazon_monkey.js
// @require      file://D:\www\leb\node-gpt\tampermonkeys\amazon_vue.js
// ==/UserScript==



class Amazon {
  constructor(){
    // 谷歌cloude shell接口连接
    this.apiBaseUrl = 'https://8080-cs-ceb9bb12-1924-4701-ad3e-b0b3b2c6173d.cs-asia-southeast1-bool.cloudshell.dev'
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

    let productLinks = $page.find('a')
      .filter((i,n) => n.href.includes('/dp/'))
      .toArray()
      .map(n => n.href.replace(/ref=.*/, ''))
    productLinks = Array.from(new Set(productLinks))
    console.log(productLinks)
    return productLinks
  }

  async collectDetail(url){
    let html = await this.getPageHtml(url)
    let $page = $(html)

    let productId = url.match(/\/dp\/([^/]+)/)[1]; //B01N05APQY

    // 标题
    let productTitle = $page.find('#productTitle').text().trim();

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

    // 书籍详情清单
    let detailBullets = []
    $page.find('#detailBullets_feature_div li').each((i, n) => {
      let text = $(n).text().trim().replace(/\s{2,}/g, '')
      detailBullets.push(text)
    })

    // 图片
    let fromStr = "'colorImages': "
    let fromI = html.indexOf(fromStr)
    let endI = html.indexOf("'colorToAsin':")
    let imgCode = html.slice(fromI + fromStr.length, endI).trim().replace(/,$/, '').replace(/'/g, '"')
    let imgs = JSON.parse(imgCode)
    imgs = imgs.initial.map(n => {
      return Object.keys(n.main)[0]
    })
    
    let res = {
      productId,
      productTitle,
      productDescription,
      featurebullets,
      detailBullets,
      imgs,
      cost,
      bookDescription,
      editorialReviews,
    }
    console.log(res)
    return res
    
  }

  async addProductToSheet(proInfo){
    GM_xmlhttpRequest({
      method: "POST", 
      url: `${this.apiBaseUrl}/addProductToSheet`,
      data : JSON.stringify(proInfo),
      headers: {"Content-Type": "application/json"},
      onload: function(response) {
        console.log(2222, response.responseText);
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
//   amazon.addProductToSheet(proInfo)
// })();