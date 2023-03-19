import { Router } from 'express';
import { DatasetController } from '../controllers/dataset';

const dataset = Router();

dataset.post("/api/dataset", DatasetController.InsertValues);

export default dataset;