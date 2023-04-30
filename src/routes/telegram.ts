import { Router } from 'express'
import { TelegramController } from '../controllers/telegram';

const telegram = Router();

telegram.post("/api/telegram/notify", TelegramController.NotifyShipCondition)

export default telegram;