import { Router } from "express";
import { PredictController } from "../controllers/predict";

const predict = Router();

predict.post("/api/predict", PredictController.GetPredictOutputResults);

export default predict;