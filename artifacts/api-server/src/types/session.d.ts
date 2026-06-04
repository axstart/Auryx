import "express-session";

declare module "express-session" {
  interface SessionData {
    user: {
      id: number | null;
      email: string;
      name: string;
      role: "admin" | "staff";
    };
  }
}
