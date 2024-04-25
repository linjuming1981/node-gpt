const marked = require('marked')

class ContentRender {
  constructor(){}

  markdownToHtml(md){
    let html = marked.parse(md)
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