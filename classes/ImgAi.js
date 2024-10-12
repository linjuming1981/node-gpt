const axios = require('axios');
const fs = require('fs')
const path = require('path')

// 在线调试页面： 
// https://huggingface.co/black-forest-labs/FLUX.1-schnell
// https://yanze-pulid-flux.hf.space/?__theme=light
// https://deepinfra.com/black-forest-labs/FLUX-1-schnell


class ImgAi {

  getToken(){
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

  // 调用huggingface接口，返回图片二进制数据
  async createImg(params, savePath=''){
    const token = this.getToken();
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      {
        inputs: params.prompt,
        guidance_scale: params.guidance_scale || 7.5, // 控制生成图像的多样性与提示词的相关性。较高的值会使生成的图像更贴近提示词，通常在 4 到 9 之间调整。
        num_inference_steps: params.num_inference_steps || 4, // 指定模型生成图像所需的推理步骤数。FLUX.1 [schnell] 模型通常建议使用 1 到 4 步骤，以实现快速生成。
        max_sequence_length: params.max_sequence_length || 10000, // 设置输入提示的最大序列长度，通常为 256。
        generator: params.generator || {seed: 0}, // 用于设置随机种子，以确保生成的图像具有可重复性。例如，可以使用 torch.Generator("cpu").manual_seed(0) 来设置固定的随机种子。
        width: params.width || 1024,
        height: params.height || 1024,
        options: { // 可能包含其他选项，如是否使用缓存等。
          use_cache: params?.options?.use_cache || false, // 是否使用缓存
          wait_for_model: params?.options?.wait_for_model || true, // 设置为 true 时，如果模型正在加载，API 会等待模型准备好再返回结果。这在模型需要时间加载时非常有用。
          // 3. do_sample
          // 描述: 控制是否使用采样生成文本。如果设置为 true，模型会随机选择生成的内容，而不是总是选择最可能的结果。
          // 4. top_k
          // 描述: 设定在生成时考虑的最高概率的词汇数量。较小的值会使生成更加集中，而较大的值则增加多样性。
          // 5. top_p
          // 描述: 也称为核采样，设置为 p 时，模型会选择使得累计概率达到 p 的词汇进行生成。这个参数可以用来控制生成的多样性。
          // 6. temperature
          // 描述: 控制生成的随机性。较高的温度会导致更随机的输出，而较低的温度则使输出更确定。
          // 7. repetition_penalty
          // 描述: 用于惩罚重复生成的词汇，值越高，模型越不倾向于重复。
          // 8. max_new_tokens
          // 描述: 设置生成的最大新词数量，限制生成文本的长度。
          // 9. max_time
          // 描述: 设置生成响应的最大时间限制，超出时间限制会终止生成。
          // 10. num_return_sequences
          // 描述: 指定生成的序列数量，可以一次性生成多种不同的输出。
        }, 
      },
      {
        headers: {
          // Authorization: 'Bearer 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', // 替换为你的 Hugging Face API 密钥
          Authorization: `Bearer ${token}`, // 替换为你的 Hugging Face API 密钥
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer', // 将响应数据类型设置为 arraybuffer 以处理二进制数据
      }
    )
    
    if(savePath){
      fs.writeFileSync(savePath, response.data);
      console.log('Image saved as ' + savePath);
    }

    return response.data
  }

  async upload(imageBuffer){
    const Imgur = require('./Imgur.js')
    const imgur = new Imgur()
    const imgurLink = await imgur.uploadImage({imageBuffer})
    console.log('imgurLink', imgurLink)
    return imgurLink
  }
}

module.exports = ImgAi

if(module == require.main){
  (async() => {
    const imgAi = new ImgAi()
    const params = {
      prompt: `
      A dramatic, intricate scene set in a dimly lit, cozy room filled with luxurious fabrics and elegant furnishings. At the center, a resolute figure stands with a calm expression, holding a small, enchanted child in their arms, surrounded by a dozen attentive, majestic cats. The figure's gaze is both solemn and protective. Soft, warm lighting highlights the deep textures and rich colors of the room. The cats, with their varied fur patterns and expressive eyes, are peacefully lounging around, suggesting a bond of trust and commitment. The overall atmosphere exudes a sense of unwavering devotion and quiet strength.      
      `.trim()
      
    }
    await imgAi.createImg(params, '../temp/output.png')
  })()
}