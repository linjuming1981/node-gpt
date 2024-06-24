const marked = require('marked')
const fs = require('fs')
const path = require('path')

class ContentRender {
  constructor(){
    // this.tplPath = path.resolve(__dirname, '../public/blogger_tpl.html');
    this.tplPath = path.resolve(__dirname, '../public/aiResult_tpl.html')
    this.benefitRegex = /<article\s+id="benefit-item">([\s\S]*?)<\/article>/
  }

  getObj = str => {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object') {
        return obj;
      }
    } catch (e) {}
    return false
  }

  // 视频html
  getVideosHtml(product){
    let {videoImgs} = product;
    if(typeof videoImgs === 'string'){
      videoImgs = JSON.parse(videoImgs)
    }
    let arr = videoImgs.map(n => {
      let buyLink = this.getMyLink(n)
      let itHtml = `
        <div class="item">
          <a class="imgBox" href="${buyLink}">
            <img src="${n.imgUrl}" alt="${n.imgDesc}" />
          </a>
          <h4>${n.imgDesc}</h4>
        </div>
      `
      return itHtml
    })
    let videosHtml = arr.join('\n')
    return videosHtml
  }

  getBenefitsHtml(aiResult){
    let html = fs.readFileSync(this.tplPath).toString()
    let itemTpl = html.match(this.benefitRegex)[1]

    let arr = aiResult.benefitDetails.map(n => {
      let itemHtml = itemTpl
        .replace(/\{\{imgUrl\}\}/g, n.imgUrl)
        .replace(/\{\{imgDesc\}\}/g, n.description);
      itemHtml = `<article>${itemHtml}</article>`
      return itemHtml
    })
    let benefitsHtml = arr.join('\n')
    return benefitsHtml
  }

  getMyLink(product){
    // https://www.amazon.com/Extender-Coverage-Extenders-internet-Amplifier/dp/B0BDSM76W4
    // ?crid=RMQXETN4NMIF&dib=eyJ2IjoiMSJ9.No1WNL2S9T3IhIbSnmBWHB2sbb8SkfAAY4OJ_mJjUkoicZxp5DA-0A0AAzh80bpTaN2EXNaX3hn40jvf6ApLnKBFAV2B_Fz5q0zFNYIWHg6JTjCtSIZc6F0pPHS_Uq0J-PFCxWsOaj8zSW0GIIWukGLO7vn2QJEIO1z94D2adtxgFVdSa77DCIdjBsO63dMBXHj7shNS2rAEtqPXZIU8Z0hHV1t_hHicgcyNmj4y5OusRNRixzAB6GYx6WTP436QubwC1wYtTZxcgZDmd2Z1eER3aDvSz2AKtpJU7-zPZmU.NPwi5N78FyDpHP2cCPbMNeovKqOGErdFeIFaLLIAAXA&dib_tag=se&keywords=best+sellers&qid=1716570794&sprefix=%2Caps%2C309&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1&linkCode=ll1
    // &tag=linjuming-20&linkId=6eb1bc884d378ca271aaf4150a8e81a7&language=en_US&ref_=as_li_ss_tl
    let {productLink} = product
    let myLink = `${productLink}?tag=linjuming-20`
    return myLink
  }

  productToHtml(product){
    let {aiResult} = product
    if(typeof aiResult === 'string'){
      aiResult = JSON.parse(aiResult)
    }

    let videosHtml = this.getVideosHtml(product)
    let benefitsHtml = this.getBenefitsHtml(aiResult)  
    let myLink = this.getMyLink(product)
    let infos = {...product, ...aiResult, videosHtml, myLink}
    
    let html = fs.readFileSync(this.tplPath).toString()
    html = html.replace(this.benefitRegex, benefitsHtml)
    for(let i in infos){
      let n = infos[i]
      let obj = this.getObj(n)
      if(obj){
        continue
      }
      let regex = new RegExp(`\{\{${i}\}\}`, 'g')
      html = html.replace(regex, n)
    }
    return html
  }

}

// -------- 调试
if(module === require.main){
  let render = new ContentRender()
  let html = render.productToHtml('## title')
  console.log(html)
}

module.exports = ContentRender