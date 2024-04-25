const marked = require('marked')
const fs = require('fs')
const path = require('path')

class ContentRender {
  constructor(){
    this.tplPath = path.resolve(__dirname, '../public/blogger_tpl.html');
  }

  markdownToHtml(md){
    let mdHtml = marked.parse(md)
    let html = fs.readFileSync(this.tplPath).toString()
    html = html.replace('{{mdHtml}}', mdHtml)
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