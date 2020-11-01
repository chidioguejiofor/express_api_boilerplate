import { Request } from "express";
export type RequestType = Request & {
  decoded: Record<string, any>;
  data: Record<string, any>;
};
