export const APP_ID: number = Number.parseInt(process.env.APP_ID as string);

export const PRIVATE_KEY: string = process.env.PRIVATE_KEY as string;

export const WEBHOOK_SECRET: string = process.env.WEBHOOK_SECRET as string;

export const APP_NAME: string = process.env.APP_NAME as string;

export const PORT: number = Number.parseInt(process.env.PORT as string);

export const WEBHOOK_URL: string =
  process.env.NODE_ENV === "production"
    ? (process.env.WEBHOOK_URL as string)
    : `http://localhost:${PORT}`;

export const DEV_WEBHOOK_URL: string =
  process.env.NODE_ENV === "development"
    ? (process.env.SMEE_CLIENT_URL as string)
    : "";

export const TZ = process.env.TZ || "Asia/Kolkata";

export const GH_URL = process.env.GH_URL || "";
