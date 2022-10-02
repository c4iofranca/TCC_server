import { Request, Response } from "express";

export abstract class PiController {
  constructor() {}

  static async GetHelloWorld(req: Request, res: Response) {
    try {
      res.json({message: "Hello World"});
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
