import express, { Application, Request, Response } from 'express';
import { load } from 'ts-dotenv';
const env = load({
  PORT: Number,
});

const PORT = env.PORT || 3000;

const app: Application = express();

app.get('/', async (_: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: 'Hello World!',
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});