const marked = require('marked')
const fs = require('fs')
const path = require('path')

class ContentRender {
  constructor(){
    this.tplPath = path.resolve(__dirname, '../public/blogger_tpl.html');
  }

  // productToHtml(product){
  //   let html = fs.readFileSync(this.tplPath).toString()

  //   // markdown生成的html
  //   let mdHtml = marked.parse(product.markdownCode)

  //   // 视频html
  //   let arr = JSON.parse(product.videoImgs).map(n => {
  //     let itHtml = `
  //       <div class="item">
  //         <div class="imgBox">
  //           <img src="${n.imgUrl}" alt="${n.imgDesc}" />
  //         </div>
  //         <h4>${n.imgDesc}</h4>
  //       </div>
  //     `
  //     return itHtml
  //   })
  //   let videosHtml = arr.join('\n')

  //   // 替换模板
  //   html = html.replace('{{mdHtml}}', mdHtml)
  //   html = html.replace('{{videosHtml}}', videosHtml)
  //   return html
  // }

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
    let arr = JSON.parse(product.videoImgs).map(n => {
      let itHtml = `
        <div class="item">
          <div class="imgBox">
            <img src="${n.imgUrl}" alt="${n.imgDesc}" />
          </div>
          <h4>${n.imgDesc}</h4>
        </div>
      `
      return itHtml
    })
    let videosHtml = arr.join('\n')
    return videosHtml
  }

  productToHtml(product){
    let aiResult = JSON.parse(product.aiResult)
    let videosHtml = this.getVideosHtml(product)    
    let infos = {...product, ...aiResult, videosHtml}
    
    let tplPath = path.resolve(__dirname, '../public/apiResult_tpl.html')
    let html = fs.readFileSync(tplPath)
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