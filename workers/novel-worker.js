const NovelWorker = {
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
    this.workerLog(111111, novel)
    return novel
  },

  async postNovelToTwitter() {
    const url = 'https://node-gpt-h1b3.onrender.com/postNovelToTwitter';
    // const novelData = {
    //   title: '你的小说标题',
    //   content: '这里是小说的内容...' // 替换为实际内容
    // };
    // return await this.request(url, 'POST', novelData);
  }
};

// 示例调用
(async () => {
  try {
    const novel = await NovelWorker.getOneNovel();
    console.log('Fetched novel:', novel);
  } catch (error) {
    console.error('Error:', error);
  }
})();
