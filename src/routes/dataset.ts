import { Router } from 'express';
import { DatasetController } from '../controllers/dataset';

const dataset = Router();

dataset.post("/api/dataset/latest", DatasetController.GetLatestValuesByTimestamp);
dataset.post("/api/dataset/latest/multiple", DatasetController.GetLatestValuesBetweenTimestamp);
dataset.post("/api/dataset", DatasetController.InsertValues);

dataset.get("/api/dataset/limits", DatasetController.GetLimits);
dataset.get("/api/dataset/currentValues", DatasetController.GetValues)

export default dataset;