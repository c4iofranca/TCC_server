import { Request, Response } from "express";
import { CurrentIteration, Dataset } from "../interfaces";
import { db, tables } from "../supabase";

interface IGetLatestValuesByTimestamp {
  tags: string[];
}

interface IGetLatestValuesBetweenTimestamp extends IGetLatestValuesByTimestamp {
  endDate: Date | string;
  startDate: Date | string;
}

interface IGetLatestValuesBetweenTimestampResponse {}

export abstract class DatasetController {
  constructor() {}

  static async InsertValues(req: Request, res: Response) {
    try {
      const { data } = await db
        .from<CurrentIteration>(tables.currentIteration)
        .select("*")
        .single();

      if (data) {
        const { data: dataset } = await db
          .rpc<Dataset>("get_row_values", { row_id: data?.id })
          .single();

        const newData = { ...dataset, timestamp: new Date() };

        if (dataset) {
          await db.from(tables.dataset).insert(newData);
          await db
            .from(tables.currentIteration)
            .update({ iteration: data.id + 1 })
            .eq("id", 1);
        }

        res.json(true);
      } else {
        res.status(500).json({ message: "Insert failed!" });
      }
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async GetLatestValuesByTimestamp(req: Request, res: Response) {
    const body: IGetLatestValuesByTimestamp = req.body;

    if (body.tags.length === 0) {
      return res
        .status(204)
        .json({ message: "Tags Array should not be empty. Try again." });
    }

    const columns = body.tags.join(", ");
    try {
      const { data, error } = await db
        .from(tables.dataset)
        .select(columns)
        .order("timestamp", { ascending: false })
        .limit(1);

      res.json(data);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async GetLatestValuesBetweenTimestamp(req: Request, res: Response) {
    const body: IGetLatestValuesBetweenTimestamp = req.body;

    if (body.tags.length === 0) {
      return res
        .status(204)
        .json({ message: "Tags Array should not be empty. Try again." });
    }

    if (body.endDate === null || body.startDate === null) {
      return res
        .status(500)
        .json({ message: "Timestamp interval should not be null." });
    }

    const columns = [...body.tags, 'timestamp'].join(', ');
    try {
      const response: Record<string, number[][]> = {};

      const { data } = await db
        .from(tables.dataset)
        .select(columns)
        .order("timestamp", { ascending: false })
        .lt("timestamp", body.endDate)
        .gt("timestamp", body.startDate);

      if (data) {
        body.tags.forEach((tag) => {
          response[tag] = data?.map((d) => {
            return [new Date(d.timestamp).getTime(), d[tag]];
          });
        });
      }

      res.json(response);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
