import Joi, { NumberSchema, StringSchema } from "joi";
import { CPF_PATTERN, CURRENCY_PRECISION, PASSWORD_PATTERN } from "../utils";

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 3;

export const nameSchema: StringSchema = Joi.string().trim().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH);
export const cpfSchema: StringSchema = Joi.string().trim().pattern(CPF_PATTERN, { name: "CPF" });
export const passwordSchema: StringSchema = Joi.string().trim().pattern(PASSWORD_PATTERN, { name: "Password" });

export const accountNumber: NumberSchema = Joi.number().positive().integer();
export const value: NumberSchema = Joi.number().positive().precision(CURRENCY_PRECISION);
