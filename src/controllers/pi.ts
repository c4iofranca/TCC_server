import { Request, Response } from "express";
import { db } from "../supabase";

export abstract class PiController {
  constructor() {}

  static async GetLatestTagValues(req: Request, res: Response) {
    try {
      const { data, error } = await db.from("tag_values").select("*");

      res.json(data);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
