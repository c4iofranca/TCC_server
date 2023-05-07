import { Request, Response } from "express";
import { db, tables } from "../supabase";

export abstract class AlertsController {
  constructor() {}

  static async GetAlerts(req: Request, res: Response) {
    try {
      const response = await db
        .from(tables.alertOccurrence)
        .select("*")
        .order("startDate", { ascending: false });

        res.json(response.data)
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
