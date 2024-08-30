export default {
  async fetch(request, env) {
    if (request.method === 'POST') {
      try {
        // 解析 POST 请求的 JSON 数据
        const { prompt } = await request.json();

        // 检查是否提供了 prompt 参数
        if (!prompt) {
          return new Response('Missing "prompt" in request body', { status: 400 });
        }

        // 定义传递给 AI 模型的输入参数
        const inputs = {
          prompt: prompt,
        };

        // 调用 Cloudflare 的 AI 服务来生成图像
        const response = await env.AI.run(
          '@cf/stabilityai/stable-diffusion-xl-base-1.0',
          inputs,
        );

        // 返回生成的图像
        return new Response(response, {
          headers: {
            'content-type': 'image/png',
          },
        });

      } catch (err) {
        // 处理解析 JSON 失败或其他错误
        return new Response('Invalid JSON or server error', { status: 500 });
      }
    } else {
      // 如果不是 POST 请求，返回 405 方法不允许
      return new Response('Method Not Allowed', { status: 405 });
    }
  },
};
