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

  async getPage(url){
    if (!this.context) {
      throw new Error('Browser context is not initialized. Call initialize() first.');
    }
    const pages = await this.context.pages();
    console.log(111, pages)

  }



}

module.exports = AutoTest

// 调试
if(module === require.main){
  (async () => {
    const autoTest = new AutoTest();
    await autoTest.initialize();
    await autoTest.getPage()
    await autoTest.closeBrowser();
  })();
}
