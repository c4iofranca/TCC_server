import { Request, Response } from "express";
import { CurrentIteration, Dataset } from "../interfaces";
import { db, tables } from "../supabase";

export abstract class DatasetController {
  constructor() {}

  static async InsertValues(req: Request, res: Response) {
    try {
      const { data } = await db.from<CurrentIteration>(tables.currentIteration).select("*").single();

      if (data) {
        const { data: dataset } = await db.rpc<Dataset>('get_row_values', { row_id: data?.id }).single();

        const newData = { ...dataset, timestamp: new Date()}

        if (dataset) {
          await db.from(tables.dataset).insert(newData)
          await db.from(tables.currentIteration).update({ iteration: data.id + 1}).eq('id', 1)
        }

        res.json(true);
      } else {
        res.status(500).json({ message: 'Insert failed!'})
      }
      
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
