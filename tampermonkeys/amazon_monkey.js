class Amazon {
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

  async collectPage(url){
    let html = await this.getPageHtml(url)
    let $page = $(html)

    // 标题
    let productTitle = $page.find('#productTitle').text().trim();

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

    let imgs = $page.find('#imgTagWrapperId img').attr('data-a-dynamic-image')
    console.log(JSON.parse(imgs))

    return {
      productTitle,
      bookDescription,
      featurebullets,
      editorialReviews,
      detailBullets,
    }
      
  }
}

(async () => {
  let amazon = new Amazon();
  let url = 'https://www.amazon.com/dp/B006IE2IO8/'
  url = location.href
  let res = await amazon.collectPage(url)
  // console.log(res)
})();