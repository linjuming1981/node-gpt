
var Util = {};

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Util = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // ----------------------------------
  Util = {
    request(option){
      option = {
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        ...option
      }
      if(option.data){
        option.data = JSON.stringify ( option.data )
      }
      return new Promise(resolve => {
        GM_xmlhttpRequest({
          ...option,
          onload(xhr){
            let result = xhr.response || xhr.responseText
            console.log('GM_xmlhttpRequest 返回', result)
            resolve(result)
          },
          onerror(error){
            console.log('GM_xmlhttpRequest 报错', error)
            resolve(false)
          }
        })
      })
    },

    getGptPort(){
      let port = 9224
      // if(navigator.userAgent.includes('Chrome/127.0.0.0')) { // 本地默认商用chrome浏览器是127，chromium是128
      //   port = 9224
      // }
      return port
    },

    async gptAsk(text, returnType='html'){
      let port = this.getGptPort()
      console.log({port, text});
      let res = await this.request({
        url: `http://localhost:9000/gptFillQuery`,
        // url: `http://localhost:9000/diaFillQuery`,
        method: 'post',
        data: {
          text,
          port,
          returnType,
        }
      })
      if(!res.data){
        console.log('gptAsk返回false');

        // const isUnswerErr = Array.from(document.querySelectorAll('.text-xs'))
        //   .filter(n => n.innerText.trim() === '生成回复时出错').length > 0

        // if(isUnswerErr){
        // }
        
        setTimeout(() => {
          const curAction = unsafeWindow.curAction
          location.href = `https://chatgpt.com/?action=${curAction}`
        }, 3000)

      }
      return res.data
    },

    async gptStop(){
      let port = this.getGptPort();
      let res = await this.request({
        url: `http://localhost:9000/gptStop`,
        method: 'post',
        data: {
          port,
        }
      })
      return res.data
    },

    async diaStop(){
      let port = this.getGptPort();
      let res = await this.request({
        url: `http://localhost:9000/diaStop`,
        method: 'post',
        data: {
          port,
        }
      })
      return res.data
    },

    async refreshGptPage(){
      let port = this.getGptPort();
      let res = await this.request({
        url: `http://localhost:9000/refreshGptPage`,
        method: 'post',
        data: {
          port,
        }
      })
      return res.data
    },

    // 函数：将文本截取到最大长度，并确保不会断开单词
    truncateText(text, maxLength = 280, tailStr='...') {
      const alltext = `${text}${tailStr}`
      if (alltext.length <= maxLength) return text;

      let truncated = text.slice(0, maxLength - tailStr.length);
      
      // 查找最后一个空格，确保不会截断单词
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > -1) {
        truncated = truncated.slice(0, lastSpace);
      }

      // 添加省略号
      return truncated + tailStr;
    },

    // 给url添加传参
    addUrlParams(key, value, url='') {
      let urlObj = new URL(url || location.href);
      
      if (urlObj.searchParams.has(key)) {
        urlObj.searchParams.set(key, value);
      } else {
        urlObj.searchParams.append(key, value);
      }
      
      return urlObj.toString();
    },

    // 获取时间
    getDateTime(time){
      let dt
      if(!time){
        dt = new Date();
      } else {
        dt = new Date(time)
      }
      
      // 格式化日期和时间为 YYYY-MM-DD HH:MM:SS
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, '0');  // 月份是从 0 开始的，需要加 1
      const day = String(dt.getDate()).padStart(2, '0');
      const hours = String(dt.getHours()).padStart(2, '0');
      const minutes = String(dt.getMinutes()).padStart(2, '0');
      const seconds = String(dt.getSeconds()).padStart(2, '0');
      const dateTimeStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return dateTimeStr
    },

    // 从对象中随机抽取一个属性的值
    getObjRandItem(obj){
      const keys = Object.keys(obj);
      const randomIndex = Math.floor(Math.random() * keys.length); // 生成随机索引
      const key = keys[randomIndex];
      return obj[key]
    },

  };

  return Util;
}));
