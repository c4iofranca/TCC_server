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
      const y1 = db
        .from(tables.predictOutputs)
        .select("*")
        .order("timestamp", { ascending: false })
        .lt("timestamp", body.endDate)
        .gt("timestamp", body.startDate)
        .eq("model_output_name", "y1");

      const y2 = db
        .from(tables.predictOutputs)
        .select("*")
        .order("timestamp", { ascending: false })
        .lt("timestamp", body.endDate)
        .gt("timestamp", body.startDate)
        .eq("model_output_name", "y2");

      const [ { data: y1Data}, { data: y2Data} ] = await Promise.all([y1, y2])

      const response: Record<string, number[][]> = {};

      if (y1Data) {
        response["y1"] = y1Data.map(d => {
          return [new Date(d.timestamp).getTime(), d.value]
        })
      }

      if (y2Data) {
        response["y2"] = y2Data.map(d => {
          return [new Date(d.timestamp).getTime(), d.value]
        })
      }
      
      res.json(response)
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
