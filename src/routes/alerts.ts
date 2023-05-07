import { Router } from 'express';
import { AlertsController } from '../controllers/alerts';

const alerts = Router();

alerts.get("/api/alerts", AlertsController.GetAlerts)

export default alerts;