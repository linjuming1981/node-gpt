const axios = require('axios');

class HugAi {
  getToken() {
    const accounts = {
      'linjuming': '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',
      'g2g2qlmy@maillazy.com': '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', // inHeart@007
      'qt7ifsi0@maillazy.com': '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', // inHeart@007
    }
    const accountKeys = Object.keys(accounts); // 获取所有账号的键
    const randomIndex = Math.floor(Math.random() * accountKeys.length); // 生成随机索引
    const randomAccount = accountKeys[randomIndex]; // 获取随机账号
    console.log('use hf_account:', randomAccount)
    return accounts[randomAccount]; // 返回对应的 API 密钥
  }

  // 总结文章
  async summary(text) {
    const apiToken = this.getToken()
    const model = 'facebook/bart-large-cnn';  // 使用 BART 模型， 
    // Facebook的bart-large-cnn模型擅长文本摘要。它基于BART（Bidirectional and Auto-Regressive Transformers）架构，经过专门针对摘要任务的训练，特别是对新闻文章或较长文本的抽象式摘要。相比于提取式摘要（直接从文本中抽取句子），抽象式摘要能够生成具有更高语言流畅性和信息压缩性的总结。
    // 具体应用场景包括：
    // 新闻文章摘要：将长篇新闻文章压缩成简短的核心内容。
    // 文档和报告摘要：帮助从冗长的报告或文档中提取关键信息。
    // 书籍或章节摘要：总结书籍、章节或研究论文的主要要点。
    // 生成式文本总结：不仅限于提取关键句子，还能生成新的句子来总结重要信息。

    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${model}`,
        { inputs: text, },
        { headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json', }, }
      );

      console.log('Summary:', response.data);
      return response.data[0].summary_text;
    } catch (error) {
      console.error('Error fetching summary:', error.response ? error.response.data : error.message);
    }
  }

}

module.exports = HugAi;

if(module === require.main){
  const hugAi = new HugAi()
  const inputText = `Hugging Face provides an API for language models. The BART model is known for its capabilities in text summarization, and it's often used for summarizing large documents.`
  hugAi.summary(inputText)
}