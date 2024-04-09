"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ts_dotenv_1 = require("ts-dotenv");
const env = (0, ts_dotenv_1.load)({
    PORT: Number,
});
const PORT = env.PORT || 3000;
const app = (0, express_1.default)();
app.get('/', async (_, res) => {
    return res.status(200).send({
        message: 'Hello World!',
    });
});
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
});
