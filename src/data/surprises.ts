export interface SurpriseSuggestion {
  text: string;
  category: "flower" | "gift" | "date" | "surprise";
}

interface SurpriseSet {
  occasion: string;    // 适用场景
  occasionEmoji: string;
  suggestions: SurpriseSuggestion[];
}

/**
 * 惊喜建议库
 * 按场景组织，每个场景包含4类建议
 */
export const SURPRISE_SETS: SurpriseSet[] = [
  {
    occasion: "生日",
    occasionEmoji: "",
    suggestions: [
      { text: "一束她最喜欢的花，加上手写的贺卡，比任何礼物都更打动人心", category: "flower" },
      { text: "悄悄记下她最近提到的东西，在生日那天送给她", category: "gift" },
      { text: "订一家她一直想去但没去成的餐厅，提前联系餐厅准备小惊喜", category: "date" },
      { text: "零点准时送上祝福，做第一个祝她生日快乐的人", category: "surprise" },
    ],
  },
  {
    occasion: "周年纪念",
    occasionEmoji: "",
    suggestions: [
      { text: "送和你们在一起年份相同数量的玫瑰花，每朵代表一年的爱", category: "flower" },
      { text: "定制一本属于你们的相册，从第一天到现在的所有回忆", category: "gift" },
      { text: "回到你们第一次约会的地方，重新走一遍当初的路", category: "date" },
      { text: "写一封长信，回忆这一年来最让你感动的瞬间", category: "surprise" },
    ],
  },
  {
    occasion: "情人节",
    occasionEmoji: "",
    suggestions: [
      { text: "红玫瑰是经典，但粉色玫瑰更温柔，更适合她", category: "flower" },
      { text: "送一条刻有你们名字首字母的项链，简约又珍贵", category: "gift" },
      { text: "在家布置一个小小的烛光晚餐，比外面的餐厅更有心意", category: "date" },
      { text: "提前在房间里藏好小纸条，每张写一句你爱她的理由", category: "surprise" },
    ],
  },
  {
    occasion: "七夕",
    occasionEmoji: "✨",
    suggestions: [
      { text: "满天星搭配白玫瑰，像夜空中散落的星星一样浪漫", category: "flower" },
      { text: "亲手编一条红绳手链，寓意牵住彼此的心", category: "gift" },
      { text: "找一个可以看星星的地方，带上毯子和零食，一起数星星", category: "date" },
      { text: "用语音录一段话发给她，讲你们相遇的故事", category: "surprise" },
    ],
  },
  {
    occasion: "圣诞节",
    occasionEmoji: "",
    suggestions: [
      { text: "一束冬青和红玫瑰的组合，温暖整个冬天", category: "flower" },
      { text: "送一条柔软的围巾，让她每次戴的时候都想到你", category: "gift" },
      { text: "一起去逛圣诞集市，喝热红酒，拍搞怪的合照", category: "date" },
      { text: "扮成圣诞老人突然出现在她家门口，带上礼物和笑容", category: "surprise" },
    ],
  },
  {
    occasion: "通用",
    occasionEmoji: "",
    suggestions: [
      { text: "不需要等到节日，路边买的一小束花就足够让她开心一整天", category: "flower" },
      { text: "最好的礼物是你在某个平凡日子里突然说的一句「我爱你」", category: "gift" },
      { text: "周末早晨带她去一家没去过的咖啡店，一起发呆就很美好", category: "date" },
      { text: "在她下班回家的路上突然出现，牵起她的手一起走回去", category: "surprise" },
    ],
  },
];

/**
 * 根据场景名匹配建议集，匹配不到就用通用版
 */
export function getSurpriseSet(occasionName: string): SurpriseSet {
  const match = SURPRISE_SETS.find(
    (s) =>
      occasionName.includes(s.occasion) || s.occasion.includes(occasionName)
  );
  return match || SURPRISE_SETS[SURPRISE_SETS.length - 1]; // 最后一个就是"通用"
}
