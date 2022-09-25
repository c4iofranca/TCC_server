import { Router } from 'express';
import { PiController } from '../controllers/pi';

const pi = Router();

pi.get("/api/latest", PiController.GetLatestPiDataArchiveValues);

export default pi;