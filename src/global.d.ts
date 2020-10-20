import { Request } from "express";
export type RequestType =  Request & {data: Record<string,any>};
