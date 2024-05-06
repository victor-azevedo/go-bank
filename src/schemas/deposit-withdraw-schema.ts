import Joi, { ObjectSchema } from "joi";
import { value } from "./basics-schema";

export const accountDepositOrWithdrawSchema: ObjectSchema = Joi.object<AccountDepositOrWithdrawSchemaBody>({
  value: value.required(),
});

export interface AccountDepositOrWithdrawSchemaBody {
  value: number;
}
