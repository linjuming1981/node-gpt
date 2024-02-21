// run `node index.js` in the terminal

// console.log(`Hello Node.js v${process.versions.node}!`);

// const axios = require('axios');
// // console.log(axios);

// const postData = {
//   messages: [
//     {
//       role: 'system',
//       content:
//         '\nYou are ChatGPT, a large language model trained by OpenAI.\nKnowledge cutoff: 2021-09\nCurrent model: gpt-3.5-turbo-16k-0613\nCurrent time: 2023/9/25 下午3:13:09\n',
//     },
//     {
//       role: 'user',
//       content: '你好\n',
//     },
//   ],
//   stream: false,
//   model: 'gpt-3.5-turbo-16k-0613',
//   temperature: 0.5,
//   presence_penalty: 0,
//   frequency_penalty: 0,
//   top_p: 1,
// };
// const apiUrl = 'https://chat.yuina.cn/api/openai/v1/chat/completions';

// axios({
//   url: apiUrl,
//   method: 'post',
//   data: postData,
//   headers: {
//     'Content-type': 'application/json',
//     Authorization: 'Bearer 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',
//   },
// })
//   .then((res) => {
//     // console.log(1111, res);
//     const text = res.data.choices[0].message.content;
//     console.log(222333, text);
//   })
//   .catch((err) => {
//     console.log(222, err);
//   });

(async () => {
  const ChatGpt = require('./classes/ChatGpt.js');
  const gpt = new ChatGpt('writeStoryByKeyWord');
  const resText = await gpt.post('春天，阳光，美女，邂逅，回忆');
  console.log(resText);
})();

// (async () => {
//   const { Configuration, OpenAIApi } = require('openai');

//   const configuration = new Configuration({
//     apiKey: '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',
//   });
//   const openai = new OpenAIApi(configuration);

//   const completion = await openai.createCompletion({
//     model: 'text-davinci-003',
//     prompt: 'Hello world',
//   });
//   console.log(completion.data.choices[0].text);
// })();
