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

  async getPage(url, isExactEqual=false){
    if (!this.context) {
      throw new Error('Browser context is not initialized. Call initialize() first.');
    }
    const pages = await this.context.pages();
    let page
    if(isExactEqual){ // 精确匹配 
      page = pages.find(n => n._mainFrame._url === url)
    } else { // 模糊匹配
      page = pages.find(n => n._mainFrame._url.includes(url))
    }
    return page
  }

  async gptFillQuery(text) {
    try {
      const page = await this.getPage('chatgpt.com');
      await page.fill('#prompt-textarea', text)
      await page.click('[data-testid="send-button"]');
      
      // 等待 stop-button 可见
      const stopBtn = page.locator('[data-testid="stop-button"]');
      await stopBtn.waitFor({ state: 'visible' });
      console.log('GPT 在回答中...');

      // 等待 stop-button 消失（即变成 send-button）
      await stopBtn.waitFor({ state: 'hidden' });

      // 抓取最后一个 conversation-turn 元素的 HTML 内容
      const elements = page.locator('div[data-testid^="conversation-turn-"]');
      const lastElement = elements.nth(await elements.count() - 1);
      
      // 在最后一个 conversation-turn 元素中抓取 class="markdown" 元素
      const markdownElement = lastElement.locator('.markdown');
      const markdownHtml = await markdownElement.innerHTML();
      return markdownHtml;
    } catch (err) {
      console.error('gptFillQuery 执行失败:', err);
      return 'error';
    }
  }

}

module.exports = AutoTest

// 调试
if(module === require.main){
  (async () => {
    const autoTest = new AutoTest();
    await autoTest.initialize();
    const text = '今天星期几'
    const unswer = await autoTest.gptFillQuery(text)
    console.log(unswer);
    await autoTest.closeBrowser();
  })();
}
