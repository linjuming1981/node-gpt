
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
      let port = 9222
      if(navigator.userAgent.includes('Chrome/127.0.0.0')) { // 本地默认商用chrome浏览器是127，chromium是128
        port = 9224
      }
      return port
    },

    async gptAsk(text){
      let port = this.getGptPort()
      console.log({port, text});
      let res = await this.request({
        url: `http://localhost:9000/gptFillQuery`,
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
    }

  };

  return Util;
}));
