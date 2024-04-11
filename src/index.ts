import {
  ClientConfig,
  Client,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  TextMessage,
  MessageAPIResponseBase,
} from "@line/bot-sdk";
import express, { Application, Request, Response } from "express";
import { load } from "ts-dotenv";
import { getTrashSchedule } from "./trashSchedule";
import dayjs from "dayjs";

const env = load({
  CHANNEL_ACCESS_TOKEN: String,
  CHANNEL_SECRET: String,
  PORT: Number,
});

const PORT = env.PORT || 3000;

//LINE Messaging APIの設定
const config = {
  channelAccessToken: env.CHANNEL_ACCESS_TOKEN,
  channelSecret: env.CHANNEL_SECRET,
};

const clientConfig: ClientConfig = config;
const middlewareConfig: MiddlewareConfig = config;
const client = new Client(clientConfig);

const app: Application = express();

//ルートパスにアクセスしたときの処理
app.get("/", async (_: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "success",
  });
});

//明日の日付を取得する関数
const getTomorrowDay = (): number => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.getDay();
};

//第何週かを取得する
const getWeekNumber = (date: Date): number => {
  const dayjsObject = dayjs(date);
  return Math.floor(
    (dayjsObject.date() + dayjsObject.startOf("month").day() + 6) / 7
  );
};

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

//メッセージイベントを処理する関数
const textEventHandler = async (
  event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  const { replyToken } = event;
  const { text } = event.message;
  const responseText = generateResponse(text);
  const response: TextMessage = {
    type: "text",
    text: responseText,
  };
  await client.replyMessage(replyToken, response);
};

//LINE Messaging APIのWebhookにPOSTリクエストを送るエンドポイント
app.post(
  "/webhook",
  middleware(middlewareConfig),
  async (req: Request, res: Response): Promise<Response> => {
    const events: WebhookEvent[] = req.body.events;
    await Promise.all(
      events.map(async (event: WebhookEvent) => {
        try {
          await textEventHandler(event);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
          }
          return res.status(500);
        }
      })
    );
    return res.status(200);
  }
);

//サーバーを起動する
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});
