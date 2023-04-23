import { Telegraf } from "telegraf";
import fetch from "node-fetch";
import { TELEGRAM_BOT_TOKEN } from "../constants";

const bot = new Telegraf(TELEGRAM_BOT_TOKEN || "");

export default async function notifyShipCondition(y1: number, y2: number) {
  const { result } = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN || ""}/getUpdates`
  )
    .then((res) => res.json())
    .then((res) => {
      return res;
    });

  if (result.length === 0) {
    return;
  }

  const chatIds = result?.map((chat: { message: { chat: { id: any } } }) => {
    return chat?.message?.chat?.id;
  });
  const uniqueIds = [...new Set(chatIds)] as number[];

  let message = "";
  if (y2 >= 0.99 && y2 < 1) {
    message += "A Saúde da Turbina está boa.";
  } else {
    message += `A Saúde da Turbina está baixa. Requer atenção e possível manutenção. Valor: ${y2.toFixed(4)}`;
  }

  message += "\n\n";

  if (y1 >= 0.98 && y1 < 1) {
    message += "A Saúde do Compressor está boa.";
  } else {
    message += `A Saúde do Compressor está baixa. Requer atenção e possível manutenção. Valor: ${y1.toFixed(4)}`;
  }

  message += "\n\n";
  message += "Acesse o painel de monitoramento para mais detalhes: https://tcc-web-zeta.vercel.app/";

  uniqueIds.forEach(async (id) => {
    await bot.telegram.sendMessage(id, message)
  })
}
