const fs = require('fs')
const path = require('path')
const axios = require('axios');

class Novel {
  constructor(){} 

  getGSheet(){
    const GoogleSheet = require('./GoogleSheet.js')
    const bookSheet = new GoogleSheet({
      sheetId: '1QWY7q2HxQMq2D2DhDSxXjErWbRgZIEtpQqELnMVd0QY',
      sheetTabName: '工作表1'
    })
    return bookSheet
  }

  // 根据小说内容文件，将里面的每一个章节内容提取出来，用数组输出   
  splitBookToChapters(file) {
    let cont = fs.readFileSync(file).toString();
    // 使用正则表达式匹配章节标题和内容
    let chapters = cont.split(/\n(?=\s*(第|序).*章\s)/).filter(Boolean); // 分割并过滤掉空白项
    let chapterArr = [];
    // console.log(chapters)

    chapters.forEach(chapter => {
      let titleMatch = chapter.match(/(第|序).*章\s\S+/);
      if(!titleMatch){
        return true
      }
      let title = titleMatch ? titleMatch[0] : "Unknown Title";
      let content = chapter.replace(title, '').trim();
      chapterArr.push({ cnTitle: title, cnCont: content });
    });

    return chapterArr;   
  }

  // 保存小说章节到google sheet
  saveChapterToSheet(items){
    const bookSheet = this.getGSheet();
    bookSheet.addSheetDatas({datas: items})
  }

  splitChapterContent(chapterCont, perWordCont = 2500) {
    let outPutArr = [];
    let currentSegment = '';
    let currentLength = 0;
  
    chapterCont.split('\n').forEach(paragraph => {
      if (currentLength + paragraph.length <= perWordCont) {
        currentSegment += paragraph + '\n'; 
        currentLength += paragraph.length;
      } else {
        outPutArr.push(currentSegment.trim());
        currentSegment = paragraph + '\n';
        currentLength = paragraph.length;
      }
    });
  
    if (currentSegment.length > 0) {
      outPutArr.push(currentSegment.trim());
    }
  
    return outPutArr;
  }

  renderHtml(novel, lang='en'){
    let title = novel[`${lang}Title`]
    let cont = novel[`${lang}Cont`]
    let novelHtml = `
      <div class="novel_detail">
        <div class="chapter_img">
          <img src="${novel.imgUrl}" alt="${title}" />
        </div>
        <article class="novel_cont">${cont}</article>
      </div>
    `
    const tplHtml = fs.readFileSync(path.resolve(__dirname, '../public/novel_tpl.html')).toString()
    let html = tplHtml.replace('{{novelHtml}}', novelHtml)
    return html
  }

  async postToBlogger(product){
    let html = this.renderHtml(product, 'en')
    const GoogleBlogger = require('./GoogleBlogger.js') 
    const blogger = new GoogleBlogger()
    const blogId = '8875046865650114267' // 小说的博客id
    const ret = await blogger.createPost({blogId, title:product.enTitle, content: html, isDraft: false})
    product = {
      productId: product.productId,
      postedToBlogger: '1',
      bloggerPostId: ret.id,
      bloggerPostUrl: ret.url,
    }
    const novelSheet = this.getGSheet()
    await novelSheet.updateRow({product})
    return ret
  }

  // 调用worker ai创建图片，返回图片链接
  async createNovelChaterImgByWorker(imgPrompt){
    const cloudFlareApiUrl = 'https://stable-img.mingfish.workers.dev';
    const response = await axios.post(cloudFlareApiUrl, {prompt: imgPrompt}, {
      responseType: 'arraybuffer'  // 确保接收的是二进制数据
    })
    const imageBuffer = Buffer.from(response.data);
    
    const Imgur = require('./Imgur.js')
    const imgur = new Imgur()
    const imgurLink = await imgur.uploadImage({imageBuffer})
    console.log('imgurLink', imgurLink)
    return imgurLink
  }

  // 调用huggingface接口生成小说图片
  async createNovelChaterImg(imgPrompt){
    const ImgAi = require('./ImgAi.js')
    const imgAi = new ImgAi()
    const imageBuffer = await imgAi.createImg({prompt: imgPrompt})

    const Imgur = require('./Imgur.js')
    const imgur = new Imgur()
    const imgurLink = await imgur.uploadImage({imageBuffer})
    console.log('imgurLink', imgurLink)
    return imgurLink
  }

  // 发帖到twitter
  async postToTwitter(product){
    const Twitter = require('./Twitter.js')
    const twitter = new Twitter()
    const res = await twitter.createPost({
      title: product.enTitle,
      text: product.subCont,
      bloggerPostUrl: product.bloggerPostUrl,
      imgUrl: product.imgUrl,
    })
    return res
  }
  
  // 发帖到Tumblr
  async postToTumblr(product){
    const tumblr = require('./Tumblr.js')
    const tumblr = new Tumblr()
    const res = await tumblr.createPost(product)
    return res
  }
  

}

module.exports = Novel;     

if(module === require.main){
  const novel = new Novel();
  const imgPrompt = `A dramatic scene of a mountain village's celebration after a successful hunt, with a backdrop of a sacred stone altar. The scene includes a group of proud hunters, rugged and muscular, displaying large exotic creatures like dragon-horned elephants and winged serpents. Villagers, including women and children, are gathered in joy, their faces reflecting relief and excitement. The village, bathed in the golden hues of the setting sun, looks ancient and sacred, with long shadows cast by the returning hunters. The atmosphere is filled with awe and reverence, with some mysterious and large beast footprints hinting at greater dangers lurking beyond.`
  novel.createNovelChaterImg(imgPrompt)
}



