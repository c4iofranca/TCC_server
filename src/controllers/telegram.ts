import { Request, Response } from "express";
import { db, tables } from "../supabase";
import { Telegraf } from "telegraf";
import { TELEGRAM_BOT_TOKEN } from "../constants";

const bot = new Telegraf(TELEGRAM_BOT_TOKEN || "");

export abstract class TelegramController {
  constructor() {}

  static async NotifyShipCondition(req: Request, res: Response) {
    try {
      const users = (await db.from(tables.users).select("*")).data;
      const activeAlerts = (
        await db.from(tables.alertOccurrence).select("*").is("endDate", null)
      ).data;
      let sendMessage = false;
      let message = `Um dos equipamentos apresenta saúde abaixo do limite e requer atenção. Em caso de dúvida, acesse o painel de monitoramento para mais detalhes: https://tcc-web-zeta.vercel.app\n\n`;

        const y1Query = db
          .from(tables.predictOutputs)
          .select("*")
          .limit(1)
          .order("timestamp", { ascending: false })
          .eq("model_output_name", "y1")
          .single();

        const y2Query = db
          .from(tables.predictOutputs)
          .select("*")
          .limit(1)
          .order("timestamp", { ascending: false })
          .eq("model_output_name", "y2")
          .single();

        const [{ data: y1 }, { data: y2 }] = await Promise.all([
          y1Query,
          y2Query,
        ]);

      const y1HasActiveAlerts = activeAlerts?.some(
        (alert) => alert.model === "y1"
      );
      const y2HasActiveAlerts = activeAlerts?.some(
        (alert) => alert.model === "y2"
      );

      if (y1.value < 0.98) {
        if (!y1HasActiveAlerts) {
          await db
            .from(tables.alertOccurrence)
            .insert({ model: "y1", startDate: new Date().toISOString() });

          message += `A Saúde do Compressor está baixa. Valor: ${y1.value.toFixed(4)}\n\n`;
          sendMessage = true;
        }
      } else {
        await db
          .from(tables.alertOccurrence)
          .update({ endDate: new Date().toISOString() })
          .eq("model", "y1")
          .is("endDate", null);
      }

      if (y2.value < 0.99) {
        if (!y2HasActiveAlerts) {
          await db
            .from(tables.alertOccurrence)
            .insert({ model: "y2", startDate: new Date().toISOString() });

          message += `A Saúde da Turbina está baixa. Valor: ${y2.value.toFixed(4)}\n\n`;
          sendMessage = true;
        }
      } else {
        await db
          .from(tables.alertOccurrence)
          .update({ endDate: new Date().toISOString() })
          .eq("model", "y2")
          .is("endDate", null);
      }

      if (sendMessage) {
        users?.forEach(async (user) => {
          await bot.telegram.sendMessage(user.chat_id, message);
        });
      }

      res.json(true);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
