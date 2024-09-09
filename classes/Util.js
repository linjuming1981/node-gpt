
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

    async gptAsk(text){
      let port = this.getGptPort()
      console.log({port, text});
      let res = await this.request({
        url: `http://localhost:9000/gptFillQuery`,
        // url: `http://localhost:9000/diaFillQuery`,
        method: 'post',
        data: {
          text,
          port,
        }
      })
      if(!res.data){
        console.log('gptAsk返回false');
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
    }

  };

  return Util;
}));
