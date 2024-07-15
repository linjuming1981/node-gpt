const fs = require('fs')

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
      chapterArr.push({ chapterTitle: title, cnCont: content });
    });

    return chapterArr;   
  }

  // 保存小说章节到google sheet
  saveChapterToSheet(items){
    const bookSheet = this.getGSheet();
    bookSheet.addSheetDatas({datas: items})
  }

  splitChapterContent(chapterCont, perWordCont = 600) {
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


}

module.exports = Novel;

if(module === require.main){
  const novel = new Novel();


}

// const file = '../gpt-novels/perfect_world.txt'
// const chapters = novel.splitBookToChapters(file)
// console.log(chapters)
// novel.saveChapterToSheet(chapters)


