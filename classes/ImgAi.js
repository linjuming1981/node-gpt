const axios = require('axios');
const { response } = require('express');

class ImgAi {

  // 调用huggingface接口，返回图片二进制数据
  async createImg(params){
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      {
        inputs: params.prompt,
        guidance_scale: 7.5 || params.guidance_scale, // 控制生成图像的多样性与提示词的相关性。较高的值会使生成的图像更贴近提示词，通常在 4 到 9 之间调整。
        num_inference_steps: 4 || params.num_inference_steps, // 指定模型生成图像所需的推理步骤数。FLUX.1 [schnell] 模型通常建议使用 1 到 4 步骤，以实现快速生成。
        max_sequence_length: 256 || params.max_sequence_length, // 设置输入提示的最大序列长度，通常为 256。
        generator: {seed: 0}, // 用于设置随机种子，以确保生成的图像具有可重复性。例如，可以使用 torch.Generator("cpu").manual_seed(0) 来设置固定的随机种子。
        width: 1024,
        height: 1024,
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
          Authorization: 'Bearer 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', // 替换为你的 Hugging Face API 密钥
          'Content-Type': 'application/json',
        },
        response: 'arraybuffer', // 将响应数据类型设置为 arraybuffer 以处理二进制数据
      }
    )
    return response.data
  }
}

module.exports = ImgAi
