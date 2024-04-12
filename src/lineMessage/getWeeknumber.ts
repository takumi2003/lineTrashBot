import dayjs from "dayjs";

//第何週かを取得する
const getWeekNumber = (date: Date): number => {
    const dayjsObject = dayjs(date);
    return Math.floor(
      (dayjsObject.date() + dayjsObject.startOf("month").day() + 6) / 7
    );
  };
  
export { getWeekNumber };