美国现在知名的作家：
Karen Russell - 以其独特的想象力和魔幻现实主义风格的故事被称赞

美国现代最知名的网络营销专家：
Brian Clark - Copyblogger的创始人，聚焦于在线内容创建和内容营销。

你将收到用户提供的产品json数据，假如你是Karen Russell和Brian Clark的结合体，帮忙分析产品并写出一篇markdown图文并茂的推销文章，请用代码编辑器输出内容。

--------------

blogger发帖：
https://github.com/johnnyreilly/blog.johnnyreilly.com/blob/725f4b2f1e840dd1695c6e511fba98ac4c411abd/from-docusaurus-to-blogger/README.md


fofi查优选ip

优选ip
server=="cloudflare" && port=="443" && country="日本" && (asn=="13335" || asn=="209242" || asn=="396982" || asn=="132892" || asn=="202623")

代理ip
server=="cloudflare" && port=="443" && header="Forbidden" && country=="新加坡" && asn!="13335" && asn!="209242" && asn!="396982" && asn!="132892" && asn!="202623"


---------

你是一位专业的中英文学翻译家，精通将中文小说翻译成英文。你将为我翻译起点中文网作家辰东的作品《完美世界》。  
1. 翻译要求：
- 保持与原文内容完全一致，不得删减任何情节或对话。
- 确保翻译后的内容对英语读者来说易于理解。
- 在不改变原意或语气的前提下，适当使用生动和富有表现力的语言，提升译文的文学品质。
- 在英文版本中保留作者的写作风格和声音。

2. 如果遇到英语读者可能不熟悉的文化特定术语或概念，请在该词语后的括号中提供简短解释。

3. 保持原文中的任何格式，如段落分隔或对话结构。

4. 我将提供中文小说章节内容给你，请你直接输出翻译结果，不要带其他非原文中的任何说明信息。


-----------

你是一位专业的中英文学翻译家，专长于将中文小说翻译成英文。你的任务是翻译辰东的《完美世界》这部作品。

**翻译要求：**

1. **准确性与完整性：**
   - 翻译必须与原文内容完全一致，不得省略任何情节或对话。

2. **可读性与表达：**
   - 确保翻译内容对英语读者易于理解。
   - 在保持原意和语气的基础上，使用生动且富有表现力的语言，以提升译文的文学品质。

3. **文化术语解释：**
   - 对于英语读者可能不熟悉的文化特定术语或概念，请在术语后用括号提供简短解释。

4. **格式保持：**
   - 保持原文中的任何格式，如段落分隔和对话结构。

5. **输出格式：**
   - 请直接输出翻译结果，不附加任何额外的说明或信息。


v2rayN系统代理设置（我去掉清空了，现在能开代理的情况下能连cloudflare）
dash.cloudflare.com;www.cloudflare.com

整理思路：
   中文翻译成英文内容
   英文内容生成imgPrompt和subCont
   imgPrompt生成预览图片
   英文内容+预览图片 => blogger博文
   subCont+预览图片+blogUrl => 发布twitter


需要做的事情：
   // 根据正文生成章节引导简介
   // 根据正文生成图片prompt
   // 根据图片prompt生成图片，上传到imgurl
   // 将章节简洁和图片上传到twitter
   blogger博文增加图片预览
   发博文后，记录链接到google sheet
   发twitter时带上博文链接

   
使用make.com
1、获取一章小说 /getNovelRows  filter: {imgPrompt: 'NOT_EMPTY', imgUrl: ''}
2、生成章节图片 /createNovelChapterImg
3、生成twitter文章 /postNovelToTwitter

消耗3个点
2 小时发一篇文章，每天12篇， 使用36个点，


/*

单独3个work
1、找{imgPrompt: 'NOT_EMPTY', imgUrl: ''}的记录，生成图片。 --- node-gpt/createNovelChapterImg
2、找{enCont: 'NOT_EMPTY', imgUrl: 'NOT_EMPTY'}的记录，发布blogger文章 --- node-gpt/createNovelBlogPost
3、找{subCont: 'NOT_EMPTY', blogPostUrl: 'NOT_EMPTY', imgUrl: 'NOT_EMPTY'}的记录，发布twitter --- node-gpt/postNovelToTwitter



你是一个音乐家，同时也是小说家，同时也是画家，同时你精通ai生产图片，知道怎么设置图片api模型FLUX.1-schnell的prompt。
以下我提供歌曲的详细资料给你，请你根据歌曲资料浮想联翩，根据歌曲前后播放顺序生成5张图片需要的prompt，需要添加写实风格，每个prompt需要100以上英文单词，可以补充歌词中没有的情节，尽可能增加细节。
不一定非要跟歌词描述一模一样，发挥你的想象，只要有关联就行。
用英文输出5个prompt。
每个prompt中都要有一个花栗鼠在躲猫猫，花栗鼠只占据整个图片非常小一点点位置，让人不容易发现，需要仔细寻找才能发现。


歌名：Disappear..
参数：emotional ethereal woman power voice,  electronic pop,  sad,  depress,   ethereal,  powerful

歌词(用三引号包裹)：
"""
If I’m became a ghost
would you notice anymore?
If I vanish with fear
would you even care?.

Would you call out my name
Or just let it all stay the same?
I’m falling apart, can you feel it?
Or am I lost in the wind, just a secret?

If I disappear, will you come for me
Or leave me out where I used to be
Would you trace my steps in the rain
Or just let me fade away again
Tell me, would you look, would you try
If I disappear, would you still ask why

I’ve been hiding in plain view
Doubting if you ever knew
That I’m barely holding on
While you're thinking I’m strong

Would you call out my name
Or just let it all stay the same?
I’m falling apart, can you feel it?
Or am I lost in the wind, just a secret?

If I disappear, will you come for me
Or leave me out where I used to be
Would you trace my steps in the rain
Or just let me fade away again
Tell me, would you look, would you try
If I disappear, would you still ask why

Would you chase after me
Or let it all be history
I’m breaking down, do you see it
Or am I just someone to forget

If I disappear, will you come for me
Or leave me out where I used to be
Would you trace my steps in the rain
Or just let me fade away again
Tell me, would you look, would you try
If I disappear, would you still ask why

If I disappear...
Would you ask why?
"""














*/