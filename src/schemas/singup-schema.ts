import Joi, { ObjectSchema } from "joi";
import { cpfSchema, nameSchema, passwordSchema } from "./basics-schema";

export const signUpSchema: ObjectSchema = Joi.object<SignUpBody>({
  name: nameSchema.required(),
  cpf: cpfSchema.required(),
  password: passwordSchema.required(),
});

export interface SignUpBody {
  name: string;
  cpf: string;
  password: string;
}
