import { Request, Response } from "express";
import { ReportService } from "../services/report.service";

const reportService = new ReportService();

export class ReportController {
  public async getDailyReport(req: Request, res: Response) {
    const date = req.query.date as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!date) {
      return res.status(400).json({ message: "Date query is required (YYYY-MM-DD)" });
    }

    try {
      const report = await reportService.getDailyReport(date, page, limit);
      res.json(report);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to generate daily report" });
    }
  }

  public async getDailyItemReport(req: Request, res: Response) {
    const date = req.query.date as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!date) {
      return res.status(400).json({ message: "Date query is required (YYYY-MM-DD)" });
    }

    try {
      const report = await reportService.getDailyItemReport(date, page, limit);
      res.json(report);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to generate daily item report" });
    }
  }
}
