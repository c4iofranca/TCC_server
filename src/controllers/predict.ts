import { Request, Response } from "express";
import { db, tables } from "../supabase";

interface IGetPredictOutputResults {
  endDate: Date | string;
  startDate: Date | string;
}

export abstract class PredictController {
  constructor() {}

  static async GetPredictOutputResults(req: Request, res: Response) {
    const body: IGetPredictOutputResults = req.body;

    try {
      const { data } = await db
        .from(tables.predictOutputs)
        .select("*")
        .order("timestamp", { ascending: false })
        .lt("timestamp", body.endDate)
        .gt("timestamp", body.startDate);

      if (data) {
        return res.json(data.map(d => {
            return [new Date(d.timestamp).getTime(), d.value]
        }))
      }
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
