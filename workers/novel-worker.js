// 实践无效，废弃

export const NovelWorker = {
  async request(url, method = 'GET', data = null) {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json(); // 返回 JSON 数据
    } catch (error) {
      console.error('Request failed:', error);
      throw error; // 重新抛出错误
    }
  },

  // 打印日志
  async workerLog(...logs) {
    // 传参数量不确定，怎么将传参变成数组
    const url = 'https://node-gpt-h1b3.onrender.com/workerLog';
    const data = {
      logs
    }
    return await this.request(url, 'POST', data);
  },

  async getOneNovel() {
    const url = 'https://node-gpt-h1b3.onrender.com/getOneNovel';
    const data = {
      filter: {imgPrompt: 'NOT_EMPTY', imgUrl: ''}
    }
    const res = await this.request(url, 'GET', data);
    const novel = res.data
    await this.workerLog(111111, novel)
    return novel
  },

  async postNovelToTwitter() {
    const url = 'https://node-gpt-h1b3.onrender.com/postNovelToTwitter';
    // const novelData = {
    //   title: '你的小说标题',
    //   content: '这里是小说的内容...' // 替换为实际内容
    // };
    // return await this.request(url, 'POST', novelData);
  },

  async run(){
    try {
      const novel = await this.getOneNovel();
      console.log('Fetched novel:', novel);
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

// 示例调用
// (async () => {
//   try {
//     const novel = await NovelWorker.getOneNovel();
//     console.log('Fetched novel:', novel);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// })();



// worker代码
// -----------------

addEventListener("scheduled", (event) => {
  event.waitUntil(handleCron(event));
});

addEventListener('fetch', event => {
  event.respondWith(handleFetch(event));
});

async function handleFetch(event) {
  return await handleCron(event); // 调试时直接调用
}

async function handleCron(event) {
  const url = 'https://node-gpt-h1b3.onrender.com/createNovelChapterImg';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { // post header传参对吗
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Content-Type': 'application/json' // 添加Content-Type
      },
      body: JSON.stringify({  // 使用body并转换为JSON字符串
        worker: 1, 
      })
    });

    if (response.ok) {
      const data = await response.text();
      console.log(`Success: ${data}`);
      return new Response(data);
    } else {
      console.error(`Fail: ${response.status}`);
      return new Response(`Fail: ${response.status}`);
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    return new Response(`Error: ${error.message}`);
  }
}

