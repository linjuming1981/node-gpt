const { chromium } = require('playwright');

class AutoTest {
  constructor({port=9224}){
    this.browser = null;
    this.context = null;
    this.port = port;
  }

  async initialize() {
    this.browser = await chromium.connectOverCDP(`http://localhost:${this.port}`);
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

      // --- 这里怎么等待2秒后再执行后续操作
      // await page.waitForTimeout(2000);
      await page.click('[data-testid="send-button"]');
      
      // 等待 stop-button 可见
      const stopBtn = page.locator('[data-testid="stop-button"]');
      await stopBtn.waitFor({ state: 'visible' });
      console.log('GPT 在回答中...');

      // 等待 stop-button 消失（即变成 send-button）
      await stopBtn.waitFor({ state: 'hidden', timeout: 120000 });

      // 抓取最后一个 conversation-turn 元素的 HTML 内容
      const elements = page.locator('article[data-testid^="conversation-turn-"]');
      const lastElement = elements.nth(await elements.count() - 1);
      
      // 在最后一个 conversation-turn 元素中抓取 class="markdown" 元素
      const markdownElement = lastElement.locator('.markdown');
      const markdownHtml = await markdownElement.innerHTML();

      // 达到了每小时限制次数
      if(markdownHtml.includes('reached our limit of messages')){
        return false
      }
      return markdownHtml;
    } catch (err) {
      console.error('gptFillQuery 执行失败:', err);
      return false;
    }
  }

  // gpt点击停止
  async gptStop(){
    const page = await this.getPage('chatgpt.com');
    await page.evaluate(() => {
      const stopBtn = document.querySelector('[data-testid="stop-button"]')
      if(stopBtn){
        stopBtn.click()
      }
    })
  }

  // 刷新页面，防止内存越来越高
  async refreshGptPage(){
    const page = await this.getPage('chatgpt.com');
    await page.goto('https://chatgpt.com')
  }

  // 使用 request API 直接发出 HTTP 请求的方法
  async sendHttpRequest(url) {
    try {
      // 在当前的浏览器上下文中使用 request API 发出请求
      const response = await this.context.request.get(url);

      // 检查响应状态
      if (response.ok()) {
        // 返回响应数据
        const data = await response.json();
        return data;
      } else {
        console.log(`Request failed with status: ${response.status()}`);
        return null;
      }
    } catch (err) {
      console.error('sendHttpRequest 执行失败:', err);
      return null;
    }
  }


}

module.exports = AutoTest

// 调试
if(module === require.main){
  (async () => {
    const autoTest = new AutoTest({port: 9224});
    await autoTest.initialize();
    // await autoTest.getPage('chatgpt.com');
    
    // await autoTest.refreshGptPage();
    const text = '今天星期几'
    const unswer = await autoTest.gptFillQuery(text)
    console.log(unswer);

    // 调用 sendHttpRequest
    // const apiUrl = 'https://8080-cs-239467590834-default.cs-europe-west4-pear.cloudshell.dev/test';
    // const response = await autoTest.sendHttpRequest(apiUrl);
    // console.log(response);

    await autoTest.closeBrowser();
  })();
}
