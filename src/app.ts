import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Routes } from "./routes";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

Routes.addRoutesToApp(app);
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World!");
});

export default app;
