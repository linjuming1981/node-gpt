const axios = require('axios');

async function summarizeText(text) {
  const apiToken = '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';  // 替换为你的 Hugging Face API 令牌
  const model = 'facebook/bart-large-cnn';  // 使用 BART 模型

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: text,  // 不需要 "summarize: " 前缀
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Summary:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching summary:', error.response ? error.response.data : error.message);
  }
}

// 示例用法
const inputText = `Despite past tensions and public criticisms, Milwaukee Bucks coach Doc Rivers and Lakers coach JJ Redick said there are no bad feelings between them.

“We’re fine,” Redick said before Thursday's game. “I don’t carry beef with people. And I’m not going to get into the history of Doc and I’s relationship right now. And I probably won’t ever. He’s fine in my book.”

Redick and the Lakers went on to beat Rivers and the Bucks 107-102 for their first win of the preseason.

During a media appearance last season on ESPN, Redick pointedly questioned Rivers’ sense of accountability after the coach talked about difficulties in taking the Milwaukee job in the middle of the season.

Read more: LeBron James on Bronny's best play from cardiac arrest return: 'He walked off on his own'

“I’ve seen the trend for years,” Redick said on "First Take." “The trend is always making excuses. Doc, we get it. Taking over a team in the middle of a season is hard. It’s hard. We get it. It’s hard. ... But it’s always an excuse. It’s always throwing your team under the bus.”

Redick said Thursday that he apologized for the tone of his comments, which ESPN posted on YouTube under the headline “JJ Redick goes SCORCHED EARTH on Doc Rivers for making excuses!”

Rivers, who coached Redick for four seasons on the Clippers, said the comments aren't an issue.

“It's never been really for me," Rivers said, before adding that "coaches, they pour into players. They really do. They pour in a ton of love to players. And oftentimes that love is rejected, it's just the way it is.”

Rivers said he expected Redick’s Lakers to be strong when it came to “execution stuff, because that's what we were known for when he played for me."

Milwaukee Bucks coach Doc Rivers watches during a game
Milwaukee Bucks coach Doc Rivers watches during a game against the Detroit Pistons on Sunday. (Jose Juarez / Associated Press)
“Ran a lot of it,” Rivers said. “As a matter of fact, I watched the first two games and many of the sets we ran with the Clippers, the Lakers are running now. ... I did the same thing as a player. You run what you know well and what you like. ... My guess is that JJ will probably take from all the coaches he played for.”

Rivers said that he’s empathetic for his top assistant, former Lakers coach Darvin Ham, who has been viewed by some as receiving indirect criticism any time a player says something positive about the Lakers’ vibes this preseason.

“There's heartbreak for coaches. Darvin's dealing with that a little bit,” Rivers said. “He sees guys make comments now that he poured into. It's not right. But that's just what happens in this part of our job. We know that going into it.”

Read more: New ‘Lake Show’ jersey 'a representation of the Lakers and the city' of L.A., LeBron James says

Thursday, the Lakers were without Austin Reaves because of ankle soreness. Redick said the issue wasn’t a concern. The team also kept minutes limits on Max Christie, Gabe Vincent and Cam Reddish.

LeBron James, like he did Sunday in Palm Desert against Phoenix, played only the first half. He scored 11 points with six rebounds and four assists. Anthony Davis, who played into the third quarter, had 11 points, eight rebounds and three blocks.

The Lakers trailed by as many as 15 in the fourth quarter before a 20-0 run by rookie Dalton Knecht and the Lakers' deep bench pushed them to the win.`;
summarizeText(inputText);
