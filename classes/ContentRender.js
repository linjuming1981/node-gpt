const marked = require('marked')

class ContentRender {
  constructor(){}

  markdownToHtml(md){
    let html = marked(md)
    return html
  }
}

if(module === require.main){
  let render = new ContentRender()
  let html = render.markdownToHtml('## title')
  console.log(html)
}

module.exports = ContentRender