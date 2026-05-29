export interface Quote {
  text: string;
  author?: string;
}

export const QUOTES: Quote[] = [
  { text: "喜欢你，是我做过最好的事情。", author: "佚名" },
  { text: "你是我温暖的手套，冰冷的啤酒，带着阳光味道的衬衫，日复一日的梦想。", author: "《恋爱的犀牛》" },
  { text: "一想到能和你共度余生，我就对余生充满期待。", author: "乔一" },
  { text: "世间万物，唯有你和爱不可辜负。", author: "佚名" },
  { text: "遇见你之后，我的世界变得温柔了。", author: "佚名" },
  { text: "你是这白开水一样淡的日子里，我偷偷加的一颗糖。", author: "佚名" },
  { text: "我想和你一起，看遍世间所有的日落。", author: "佚名" },
  { text: "和你在一起的每一天，都是值得纪念的日子。", author: "佚名" },
  { text: "爱不是相互凝望，而是一起朝同一个方向看。", author: "《小王子》" },
  { text: "你是我所有温柔的来源和归属。", author: "佚名" },
  { text: "最好的爱情，是两个人在一起变得更好。", author: "佚名" },
  { text: "我喜欢你，像风走了八千里，不问归期。", author: "佚名" },
  { text: "有你的地方，就是我想去的地方。", author: "佚名" },
  { text: "日子很长，但有你陪伴，每一天都值得期待。", author: "佚名" },
  { text: "爱是藏在细节里的温柔。", author: "佚名" },
  { text: "你一笑，我就觉得整个世界都亮了。", author: "佚名" },
  { text: "想和你虚度时光，比如低头看鱼，比如把茶杯留在桌子上离开。", author: "李元胜" },
  { text: "爱情不是寻找一个完美的人，而是学会用完美的眼光看待一个不完美的人。", author: "佚名" },
  { text: "你是人间四月天，笑响点亮了四面风。", author: "林徽因" },
  { text: "一生至少该有一次，为了某个人而忘了自己。", author: "徐志摩" },
  { text: "你来人间一趟，你要看看太阳，和你的心上人一起走在街上。", author: "海子" },
  { text: "今晚月色真美。", author: "夏目漱石" },
  { text: "愿有岁月可回首，且以深情共白头。", author: "佚名" },
  { text: "我爱你，不光因为你的样子，还因为和你在一起时我的样子。", author: "罗伊·克里夫特" },
  { text: "风止于秋水，我止于你。", author: "佚名" },
  { text: "醒来觉得甚是爱你。", author: "朱生豪" },
  { text: "不要问我心里有没有你，我余光中都是你。", author: "余光中" },
  { text: "你是我这一生等了半世未拆的礼物。", author: "佚名" },
  { text: "春风十里不如你。", author: "冯唐" },
  { text: "往后余生，风雪是你，平淡是你，清贫也是你。", author: "佚名" },
];

/**
 * 根据日期获取今日语录（同一整天不变）
 */
export function getTodayQuote(): Quote {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % QUOTES.length;
  return QUOTES[index];
}
