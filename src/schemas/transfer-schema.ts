import Joi, { ObjectSchema } from "joi";
import { accountNumber, value } from "./basics-schema";

export const transferSchema: ObjectSchema = Joi.object<TransferSchemaBody>({
  accountNumberDestiny: accountNumber.required(),
  value: value.required(),
});

export interface TransferSchemaBody {
  accountNumberDestiny: number;
  value: number;
}
