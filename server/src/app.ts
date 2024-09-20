import { Express, Request, Response  } from "express";
import express from "express";
import cors from "cors";
import { pingRouter } from "./routers/ping";
import { loggerMiddleware } from "./middleware/logger";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.use(pingRouter);

export { app };