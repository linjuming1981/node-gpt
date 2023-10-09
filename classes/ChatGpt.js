const axios = require('axios');
class ChatGpt {
  constructor(markName) {
    this.tokenKey = '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';
    // this.apiUrl = 'https://chat.yuina.cn/api/openai/v1/chat/completions';
    // this.apiUrl = 'https://api.openapi.com/v1/completions';
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.markName = markName || 'default';
    // this.markName = 'default';
  }
  getMarkContent(markName) {
    const marks = {
      default: '我能做什么事情，请给我发出指令',
      getKeyWord:
        '我能从你提供的文章或歌词中提取关键字（关键字包括有：时间，地点，人物，景物，动作，表情，情绪，穿着，天气，道具，事件）',
      writeStoryByKeyWord:
        '我能请根据你提供的关键字，写一篇500字以内的感人凄美的爱情故事',
      translate:
        '我能跟你提供的文字，翻译成中文，我会保留文字里面的大括号{}，不做翻译和去除',
    };
    return marks[markName];
  }
  async post(content) {
    const res = await axios({
      url: this.apiUrl,
      method: 'post',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + this.tokenKey,
      },
      data: {
        messages: [
          {
            role: 'system',
            content: this.getMarkContent(this.markName),
          },
          {
            role: 'user',
            content,
          },
        ],
        stream: false,
        model: 'gpt-3.5-turbo-16k-0613',
        temperature: 0.5,
        presence_penalty: 0,
        frequency_penalty: 0,
        top_p: 1,
      },
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        // console.log('[error] ', err.response.data.error.message);
        console.log('[error] ', err);
      });

    const text = res.data.choices[0].message.content;
    // const text = res;
    return text;
  }
}

module.exports = ChatGpt;
