import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiResponse } from "../utils/api-response";

export function validateSchema(
  schema: ZodSchema,
  target: "body" | "query" | "params" = "body"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[target]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return ApiResponse.error(res, "Validation error", 400, err.issues);
      }
      next(err);
    }
  };
}
