import Joi, { ObjectSchema } from "joi";
import { cpfSchema, passwordSchema } from "./basics-schema";

export const signInSchema: ObjectSchema = Joi.object<SignInBody>({
  cpf: cpfSchema.required(),
  password: passwordSchema.required(),
});

export interface SignInBody {
  cpf: string;
  password: string;
}
