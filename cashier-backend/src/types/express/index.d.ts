import { UserPayload } from "../models/interface";
import { Request } from "express";

export interface RequestCollection extends Request {
  user?: UserPayload;
}