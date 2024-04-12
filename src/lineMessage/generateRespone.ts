import { getTrashSchedule } from "./trashSchedule";
import { getWeekNumber } from "./getWeeknumber";

//ユーザーからのメッセージに対して返信を生成する関数
const generateResponse = (message: string): string => {
  if (message !== "明日のゴミの種類は何ですか？") {
    return "明日のゴミの種類は何ですか？と聞いてください。";
  }

  const schedule = getTrashSchedule();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDay = tomorrow.getDay();
  const weekNumber = getWeekNumber(tomorrow);

  let trashTypes = Object.keys(schedule).filter((type) =>
    schedule[type].includes(tomorrowDay)
  );

  if (tomorrowDay === 3) {
    const weekNumber = getWeekNumber(tomorrow);
    const alternatingTrash = weekNumber % 2 === 0 ? "ビン" : "燃やさない";
    trashTypes.push(alternatingTrash);
  }

  //第何週が偶数の時はビン、奇数の時は燃やさない
  if (tomorrowDay === 5) {
    const weekNumber = getWeekNumber(tomorrow);
    const alternatingTrash = weekNumber % 2 === 0 ? "ペット・紙パック" : "カン";
    trashTypes.push(alternatingTrash);
  }

  if (trashTypes.length === 0) {
    return "明日はゴミの収集はありません。";
  }

  return `明日のゴミの種類は以下の通りです: ${trashTypes.join(", ")}`;
};

export { generateResponse };
