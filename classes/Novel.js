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
    }
    const novelSheet = this.getGSheet()
    await novelSheet.updateRow({product})
    return ret
  }

  // 调用ai创建图片，返回图片链接
  async createNovelChaterImg(imgPrompt){
    const cloudFlareApiUrl = 'https://stable-img.mingfish.workers.dev';
    try{
      const response = await axios.post(cloudFlareApiUrl, {prompt: imgPrompt}, {
        responseType: 'arraybuffer'  // 确保接收的是二进制数据
      })
      const imageBuffer = Buffer.from(response.data);
      
      const Imgur = require('./Imgur.js')
      const imgur = new Imgur()
      const imgurLink = await imgur.uploadImage(imageBuffer)
      console.log('imgurLink', imgurLink)
      return imgurLink
    } catch (error) {
      console.error('Error creating novel chapter image:', error.message);
      return false
    }
  }

}

module.exports = Novel;

if(module === require.main){
  const novel = new Novel();

  const imgPrompt = `In a rugged mountain village, a group of children, from toddlers to teens, exercises energetically on a grassy field at dawn. A muscular man in animal skins supervises, his bronze skin glowing in the golden morning light. Nearby, a small toddler, with a clumsy but determined effort, mimics the older kids, drawing smiles from the villagers. The scene includes strong warriors training with bone clubs and metal swords, ancient stone houses, and a massive charred tree. The atmosphere is a blend of intense training and playful camaraderie, framed by the majestic, towering mountains.`
  novel.createNovelChaterImg(imgPrompt)

}

// const file = '../gpt-novels/perfect_world.txt'
// const chapters = novel.splitBookToChapters(file)
// console.log(chapters)
// novel.saveChapterToSheet(chapters)


