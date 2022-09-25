import { Request, Response } from "express";
import GetLatestValuesFromDataArchive from "../dataArchive";

export abstract class PiController {
  constructor() {}

  static async GetLatestPiDataArchiveValues(req: Request, res: Response) {
    try {
      const values = await GetLatestValuesFromDataArchive();

      res.json(values);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
