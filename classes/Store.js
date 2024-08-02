/**
 * 数据缓存
 */

var Store = {};

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
  Store = {
    get(key){
      let ls = unsafeWindow.localStorage
      let val = ls.getItem(key)
      try{
        val = JSON.parse(val)
      } catch(err){}
      return val
    },

    set(key, val){
      let ls = unsafeWindow.localStorage
      if(typeof val === 'object' && val !== null){
        val = JSON.stringify(val)
      }
      if(val !== null){
        ls.setItem(key, val)
        return true
      }
      return false
    },

    delete(key){
      let ls = unsafeWindow.localStorage
      ls.removeItem(key)
      return true
    },

  };

  return Store;
}));
