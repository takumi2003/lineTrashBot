"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_sdk_1 = require("@line/bot-sdk");
const express_1 = __importDefault(require("express"));
const ts_dotenv_1 = require("ts-dotenv");
const env = (0, ts_dotenv_1.load)({
    CHANNEL_ACCESS_TOKEN: String,
    CHANNEL_SECRET: String,
    PORT: Number,
});
const PORT = env.PORT || 3000;
const config = {
    channelAccessToken: env.CHANNEL_ACCESS_TOKEN || '',
    channelSecret: env.CHANNEL_SECRET || '',
};
const clientConfig = config;
const middlewareConfig = config;
const client = new bot_sdk_1.Client(clientConfig); //①
const app = (0, express_1.default)(); //②
app.get('/', async (_, res) => {
    return res.status(200).send({
        message: 'success',
    });
});
const textEventHandler = async (//④
event) => {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }
    const { replyToken } = event;
    const { text } = event.message;
    const response = {
        type: 'text',
        text: text,
    };
    await client.replyMessage(replyToken, response);
};
app.post(//⑤
'/webhook', (0, bot_sdk_1.middleware)(middlewareConfig), async (req, res) => {
    const events = req.body.events;
    await Promise.all(events.map(async (event) => {
        try {
            await textEventHandler(event);
        }
        catch (err) {
            if (err instanceof Error) {
                console.error(err);
            }
            return res.status(500);
        }
    }));
    return res.status(200);
});
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
});
