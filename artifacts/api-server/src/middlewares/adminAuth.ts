import { type Request, type Response, type NextFunction } from "express";

export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const adminKey = process.env.ADMIN_KEY;
  const provided = req.headers["x-admin-key"];
  if (!adminKey || provided !== adminKey) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
