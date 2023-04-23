import { Request, Response } from "express";
import fetch from "node-fetch";
import { CurrentIteration, Dataset } from "../interfaces";
import { db, tables } from "../supabase";
import { INTERVAL_PREDICT_MODEL_EXECUTION } from "../constants";
import { abbreviateNumber } from "../utils/abbreviateNumber";
import { chunkArray } from "../utils/chunkArray";
import notifyShipCondition from "../utils/setShipCondition";

interface IGetLatestValuesByTimestamp {
  tags: string[];
}

interface IGetLatestValuesBetweenTimestamp extends IGetLatestValuesByTimestamp {
  endDate: Date | string;
  startDate: Date | string;
  mainDate: Date | string;
}

interface ITotalFlueFlowResponse {
  fuel_flow: number;
  timestamp: string | Date;
}

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
          .rpc<Dataset>("get_row_values_dataset", { row_id: data?.iteration })
          .single();

        const timestamp = new Date().toISOString();

        const newData = { ...dataset, timestamp: timestamp };

        if (dataset) {
          await db.from(tables.data).insert(newData);

          await db
            .from(tables.currentIteration)
            .update({ iteration: data.iteration + 1 })
            .eq("id", 1);

          const [y1, y2] = await Promise.all([
            fetch("https://tcc-python-api.vercel.app/execute_model_y1")
              .then((res) => res.json())
              .then((res) => {
                return res;
              }),
            fetch("https://tcc-python-api.vercel.app/execute_model_y2")
              .then((res) => res.json())
              .then((res) => {
                return res;
              }),
          ]);

          // await notifyShipCondition(parseFloat(y1), parseFloat(y2))
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
        .from(tables.data)
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

    const columns = [...body.tags, "timestamp"].join(", ");
    try {
      const response: Record<string, Record<string, number[][]>> = {
        main: {},
        temporal: {},
      };

      console.log(body.endDate, body.mainDate);

      const { data: mainDate } = await db
        .from(tables.data)
        .select(columns)
        .order("timestamp", { ascending: false })
        .lt("timestamp", body.endDate)
        .gt("timestamp", body.mainDate);

      const { data: temporalData } = await db
        .from(tables.data)
        .select(columns)
        .order("timestamp", { ascending: false })
        .lt("timestamp", body.endDate)
        .gt("timestamp", body.startDate);

      if (mainDate) {
        body.tags.forEach((tag) => {
          response["main"][tag] = mainDate?.map((d) => {
            return [new Date(d.timestamp).getTime(), d[tag]];
          });
        });
      }

      if (temporalData) {
        body.tags.forEach((tag) => {
          response["temporal"][tag] = temporalData?.map((d) => {
            return [new Date(d.timestamp).getTime(), d[tag]];
          });
        });
      }

      res.json(response);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async GetLimits(req: Request, res: Response) {
    try {
      const [gauges, thermometers, manete] = await Promise.all([
        db.from("gaugelimits").select("*").single(),
        db.from("thermometerlimits").select("*").single(),
        db.from("manetelimit").select("*").single(),
      ]);

      const response = {
        gauges: gauges.data,
        thermometers: thermometers.data,
        manete: manete.data,
      };

      res.json(response);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async GetValues(req: Request, res: Response) {
    try {
      const { data } = await db
        .from(tables.data)
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

      res.json(data);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async GetTotalFlueFlow(req: Request, res: Response) {
    const startCampaign = new Date("2023-04-11 05:48:04.802").toISOString();
    const response: Record<string, any> = {};

    try {
      const { data } = await db
        .from(tables.data)
        .select("fuel_flow, timestamp")
        .order("timestamp", { ascending: true })
        .gt("timestamp", startCampaign);

      if (data) {
        const totalFlueFlow = data.reduce(function (prev, curr) {
          return prev + curr.fuel_flow * 60 * INTERVAL_PREDICT_MODEL_EXECUTION;
        }, 0);
        const { max, scale, suffix } = abbreviateNumber(totalFlueFlow);
        const totalLoad = `${max} ${suffix}T`;

        const dataChunked = chunkArray(data, data.length / 12);

        response["totalLoad"] = totalLoad;
        response["data"] = dataChunked;
      }

      res.json(response);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
