import Joi, { NumberSchema, StringSchema } from "joi";
import { CPF_PATTERN, PASSWORD_PATTERN } from "../utils";

export const nameSchema: StringSchema = Joi.string().trim().min(3).max(100);
export const cpfSchema: StringSchema = Joi.string().trim().pattern(CPF_PATTERN, { name: "CPF" });
export const passwordSchema: StringSchema = Joi.string().trim().pattern(PASSWORD_PATTERN, { name: "Password" });

export const accountNumber: NumberSchema = Joi.number().positive().integer();
export const value: NumberSchema = Joi.number().positive().precision(2);
