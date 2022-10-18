import { Router } from 'express';
import { PiController } from '../controllers/pi';

const pi = Router();

pi.get("/api/pi", PiController.GetLatestTagValues);

export default pi;