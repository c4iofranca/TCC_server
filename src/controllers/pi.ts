import { Request, Response } from "express";
import { db } from "../supabase";

export abstract class PiController {
  constructor() {}

  static async GetHelloWorld(req: Request, res: Response) {
    try {
      await db.from("Teste").insert({
        name: "teste",
      });

      res.json(true);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
