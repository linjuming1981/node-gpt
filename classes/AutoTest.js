const { chromium } = require('playwright');

class AutoTest {
  constructor(){
    this.browser = null;
    this.context = null;
  }

  async initialize() {
    this.browser = await chromium.connectOverCDP('http://localhost:9222');
    this.context = this.browser.contexts()[0];
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async getPage(url, isLike=false){
    if (!this.context) {
      throw new Error('Browser context is not initialized. Call initialize() first.');
    }
    const pages = await this.context.pages();
    let page
    if(!isLike){ // 精确匹配 
      page = pages.find(n => n._mainFrame._url === url)
    } else { // 模糊匹配
      page = pages.find(n => n._mainFrame._url.includes(url))
    }
    return page
  }

  gptFillQuery(text){

  }

}

module.exports = AutoTest

// 调试
if(module === require.main){
  (async () => {
    const autoTest = new AutoTest();
    await autoTest.initialize();
    await autoTest.getPage('chatgpt.com')
    const unswer = await autoTest.gptFillQuery('你好吗，今天星期几')
    await autoTest.closeBrowser();
  })();
}
