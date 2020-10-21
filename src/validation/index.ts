import { NextFunction, Response } from "express";
import { RequestType } from "global";
import Validator from "validatorjs";

type GET_VALUE_FROM = "body" | "query_params";

export abstract class BaseValidator {
  validateDataFrom: GET_VALUE_FROM;
  excludeFieldsThatAreNotInSchema: boolean;

  abstract SCHEMA: Record<string, unknown>;

  constructor(
    valueFrom: GET_VALUE_FROM = "body",
    excludeFieldsThatAreNotInSchema = true
  ) {
    this.validateDataFrom = valueFrom;
    this.excludeFieldsThatAreNotInSchema = excludeFieldsThatAreNotInSchema;
  }

  public excludeUnknownFields(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    if (!this.excludeFieldsThatAreNotInSchema) return data;

    const finalResult = {};
    Object.keys(this.SCHEMA).forEach((key) => {
      finalResult[key] = data[key];
    });

    return finalResult;
  }

  public validate(data: Record<string, any>) {
    const validation = new Validator(data, this.SCHEMA);
    if (validation.fails()) {
      return [false, validation.errors];
    }

    return [true, data];
  }

  public middleware = (
    req: RequestType,
    res: Response,
    next: NextFunction
  ): void | Response<unknown> => {
    let data;
    if (this.validateDataFrom === "body") {
      data = req.body;
    }

    const [success, result] = this.validate(data);
    if (success) {
      req.data = this.excludeUnknownFields(result);
      return next();
    }

    return res.json({
      message: "There was an error while validating data",
      errors: result.errors,
    });
  };
}
