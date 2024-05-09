const marked = require('marked')
const fs = require('fs')
const path = require('path')

class ContentRender {
  constructor(){
    this.tplPath = path.resolve(__dirname, '../public/blogger_tpl.html');
  }

  productToHtml(product){
    let html = fs.readFileSync(this.tplPath).toString()

    // markdown生成的html
    let mdHtml = marked.parse(product.markdownCode)

    // 视频html
    let arr = product.videoImgs.map(n => {
      let itHtml = `
        <div class="item">
          <img src="${n.imgUrl}" alt="${n.imgDesc}" />
          <h4>${imgDesc}</h4>
        </div>
      `
      return itHtml
    })
    let videosHtml = arr.join('\n')

    // 替换模板
    html = html.replace('{{mdHtml}}', mdHtml)
    html = html.replace('{{videosHtml}}', videosHtml)
    return html
  }
}

// -------- 调试
if(module === require.main){
  let render = new ContentRender()
  let html = render.markdownToHtml('## title')
  console.log(html)
}

module.exports = ContentRender