const ChatGpt = require('./ChatGpt.js');
const fs = require('fs');

class Srt {
  fileToItems(file) {
    // 读取字幕文件
    const subtitleData = fs.readFileSync(file, 'utf8');

    // 使用正则表达式匹配并提取数据
    const regex = /(\d+)\s+([\d:,]+)\s+-->\s+([\d:,]+)\s+([\s\S]+?)(?=\n|$)/g;
    const subtitles = [];
    let match;

    while ((match = regex.exec(subtitleData)) !== null) {
      const id = parseInt(match[1]);
      const time = match[2] + ' --> ' + match[3];
      const content = match[4].trim();

      subtitles.push({ id, time, content });
    }
    return subtitles;
  }

  itemsToFile(subtitles) {
    let arr = subtitles.map((n) => {
      return `${n.id}\n${n.time}\n${n.cnContent}`;
    });
    let code = arr.join('\n\n');
    console.log(code);
  }

  getConts(file) {
    let subtitles = this.fileToItems(file);
    let conts = subtitles.map((n) => {
      return `{${n.id}|${n.content}}`;
    });
    conts = conts.join('\n');
    // console.log(conts);
    return conts;
  }

  async translateFile(file) {
    let cont = this.getConts(file);
    let gpt = new ChatGpt('translate');
    let resText = await gpt.post(cont);
    let arr = resText.match(/\{[^\}]+\}/g);

    let subtitles = this.fileToItems(file);
    arr.forEach((n) => {
      n.replace(/^\{(\d+)\|(.*)\}$/, (s, s1, s2) => {
        subtitles[s1 - 1].tran = s;
        subtitles[s1 - 1].cnContent = s2;
      });
    });

    this.itemsToFile(subtitles);

    // console.log(subtitles);
  }
}

module.exports = Srt;

// ---------
let srt = new Srt();
let codes = srt.translateFile('../srts/2_rock.srt');
// console.log(codes);
