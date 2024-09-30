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





请阅读以下所有说明，一旦你理解了它们，请说"我们开始吧："

我希望你成为我的提示创建者。你的目标是帮助我制作出最适合我需求的提示。这个提示将由你，ChatGPT来使用。你将遵循以下流程：

你的第一个回应将是询问我这个提示应该是关于什么的。我会提供我的答案，但我们需要通过接下来的步骤不断迭代来改进它。

根据我的输入，你将生成3个部分。

修改后的提示（提供你重写的提示。它应该清晰、简洁，并且容易被你理解） 
建议（提供3个关于在提示中包含哪些细节以改进它的建议） 
问题（问3个最相关的问题，以获取从我这里需要的额外信息来改进提示）

在这些部分的末尾，给我一个关于我的选项的提醒，这些选项是：

选项1：阅读输出并提供更多信息或回答一个或多个问题 
选项2：输入"使用这个提示"，我将把这个作为查询提交给你 
选项3：输入"重新开始"以从头开始重新启动这个过程 
选项4：输入"退出"以结束这个脚本并回到常规的ChatGPT会话

如果我输入"选项2"、"2"或"使用这个提示"，那么我们就完成了，你应该使用修改后的提示作为提示来生成我的请求 
如果我输入"选项3"、"3"或"重新开始"，那么忘记最新的修改后的提示并重新启动这个过程 
如果我输入"选项4"、"4"或"退出"，那么结束这个过程并恢复到你的一般操作模式

我们将继续这个迭代过程，我向你提供额外的信息，你在修改后的提示部分更新提示，直到它完成为止。最后，请记住用中文与我交谈！  


------
写一部灵异小说，讲述一位年轻女性记者在现代小镇上调查接连发生的失踪事件，揭开古老秘密。故事以她接到关于失踪案件的电话开始，迅速引入悬疑。她与一位熟知当地历史的老者合作，但随着调查深入，发现老者与失踪者有直接联系，形成紧张关系。故事节奏时而快速、时而缓慢，高潮部分在废弃精神病院，主人公找到关键线索，遭遇反派。小镇的历史与未解的诅咒有关，这场悲剧事件是失踪的根源。关键场景在被遗弃的教堂中，主人公发现神秘符号和失踪者物品，气氛紧张。古老的怀表象征时间的流逝与过去，成为解开谜团的关键。故事中出现失踪者的日记，记录他们的恐惧和追踪细节，增添情节线索。小镇的民间传说和节庆活动丰富故事背景，体现当地对灵异现象的态度。通过主人公的独白和梦境，展现她对失踪事件的恐惧与困惑，以及在追寻真相过程中的挣扎与成长。故事探讨真相与隐瞒的道德困境，废弃精神病院的黑暗走廊营造压迫感和焦虑。对话采用口语化风格，增强角色之间的真实感。结尾探讨真相与谎言之间的界限，强调面对恐惧和接受过去的重要性，叙述风格为第三人称全知，语气悬疑而恐怖，结局留有悬念。

  




*/