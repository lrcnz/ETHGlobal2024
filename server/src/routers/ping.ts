import express from "express";
import { ping } from "../controllers/ping";

const pingRouter = express.Router();

pingRouter.get("/ping", ping);

export { pingRouter };
