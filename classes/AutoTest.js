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

  async gptFillQuery(text, returnType='html') {
    try {
      const page = await this.getPage('chatgpt.com');
      await page.fill('#prompt-textarea', text); // 这一步怎么等到#prompt-textare出现再fill？

      // 等待2秒后再执行后续操作
      await page.waitForTimeout(2000);

      await page.click('[data-testid="send-button"]');
      
      // 使用 Promise.race 来处理异步检查
      const stopBtn = page.locator('[data-testid="stop-button"]');
      const stopButtonVisiblePromise = stopBtn.waitFor({ state: 'visible', timeout: 600000 });
      
      // 检查是否有“生成回复时出错”的提示
      const errorCheckPromise = (async () => {
        const errorElement = page.locator('text=生成回复时出错');
        try {
          await errorElement.waitFor({ state: 'visible', timeout: 5000 });
          console.log('检测到错误：生成回复时出错');
          
          // 获取当前页面的 JavaScript 变量，并根据它决定跳转
          await page.evaluate(() => {
            const curAction = window.curAction; 
            location.href = `https://chatgpt.com/?action=${curAction}`
          });

          return '生成回复时出错';
        } catch {
          return null; // 如果没有检测到错误，返回 null
        }
      })();

      // 通过 Promise.race 来进行并行处理
      const result = await Promise.race([stopButtonVisiblePromise, errorCheckPromise]);

      // 如果 result 是一个错误消息，返回
      if (result === '生成回复时出错') {
        return false;
      }

      console.log('GPT 在回答中...');
      // 等待 stop-button 消失（即变成 send-button）
      await stopBtn.waitFor({ state: 'hidden', timeout: 600000 });

      // 抓取最后一个 conversation-turn 元素的 HTML 内容
      const elements = page.locator('article[data-testid^="conversation-turn-"]');
      const lastElement = elements.last();

      // 获取最后一个元素的内容
      const lastElementContent = await lastElement.innerText();

      if (lastElementContent.includes("我已准备就绪")) {
        return '我已准备就绪';
      }
      
      // 在最后一个 conversation-turn 元素中抓取 class="markdown" 元素
      const markdownElement = lastElement.locator('.markdown').first();
      let markdownHtml = await markdownElement.innerHTML();

      // 提取 markdown 元素中的纯文本
      if (returnType === 'text') { 
        markdownHtml = await markdownElement.innerText();
      }

      // 达到了每小时限制次数
      if(markdownHtml.includes('reached our limit of messages')){
        return false;
      }
      return markdownHtml;
    } catch (err) {
      console.error('gptFillQuery 执行失败:', err);
      return false;
    }
  }


  async diaFillQuery(text){
    try {
      const page = await this.getPage('chat.notdiamond.ai');
      await page.fill('#chat-promt', text)

      // --- 这里怎么等待2秒后再执行后续操作
      // await page.waitForTimeout(2000);
      await page.click('[data-testid="submit-chat-message"]');
      
      // 等待 stop-button 可见
      const stopBtn = page.locator('[data-testid="stop-submit-chat-message"]');
      await stopBtn.waitFor({ state: 'visible' });
      console.log('GPT 在回答中...');

      // 等待 stop-button 消失（即变成 send-button）
      await stopBtn.waitFor({ state: 'hidden', timeout: 120000 });

      // 抓取最后一个 conversation-turn 元素的 HTML 内容
      const elements = page.locator('.prose');
      const lastElement = elements.nth(await elements.count() - 1);
      const markdownHtml = await lastElement.innerHTML();

      // 达到了每小时限制次数
      if(markdownHtml.includes('reached our limit of messages')){
        return false
      }
      return markdownHtml;
    } catch (err) {
      console.error('diaFillQuery 执行失败:', err);
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

  async diaStop(){
    const page = await this.getPage('chat.notdiamond.ai');
    await page.evaluate(() => {
      const stopBtn = document.querySelector('[data-testid="stop-submit-chat-message"]')
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
    // const text = '今天星期几'
    // const unswer = await autoTest.gptFillQuery(text)
    // console.log(unswer);

    // 调用 sendHttpRequest
    // const apiUrl = 'https://8080-cs-239467590834-default.cs-europe-west4-pear.cloudshell.dev/test';
    // const response = await autoTest.sendHttpRequest(apiUrl);
    // console.log(response);
    
    // const page = await autoTest.getPage('chatgpt.com');
    // const el = page.locator('text=生成回复时出错');
    // const el1 = page.locator('[data-testid="send-button"]');
    // console.log({el,el1})

    await autoTest.closeBrowser();
  })();
}
