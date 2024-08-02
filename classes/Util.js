
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

    async gptAsk(text){
      let res = await this.request({
        url: `http://localhost:9000/gptFillQuery`,
        method: 'post',
        data: {
          text
        }
      })
      return res.data
    }

  };

  return Util;
}));
