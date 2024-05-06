import mongoose from "mongoose";

export interface User {
  name: string;
  cpf: string;
  password: string;
  isActive?: boolean;
  createdAt?: Date;
}

export interface UserDocument extends User, mongoose.Document {}

const userSchema: mongoose.Schema<UserDocument> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "Too short name."],
  },
  cpf: {
    type: String,
    unique: true,
    validate: {
      validator: isValidCPF,
      message: "Invalid CPF",
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

userSchema.virtual("id").get(function (this: UserDocument) {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

export const userModel = mongoose.model<UserDocument>("UserModel", userSchema);

function isValidCPF(cpf: string): boolean {
  let remainder: number;
  let digitsSum = 0;

  if (cpf.length !== 11 || cpf == "00000000000") return false;

  for (let i = 1; i <= 9; i++) digitsSum = digitsSum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  remainder = (digitsSum * 10) % 11;

  if (remainder == 10 || remainder == 11) remainder = 0;
  if (remainder != parseInt(cpf.substring(9, 10))) return false;

  digitsSum = 0;
  for (let i = 1; i <= 10; i++) digitsSum = digitsSum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  remainder = (digitsSum * 10) % 11;

  if (remainder == 10 || remainder == 11) remainder = 0;
  if (remainder != parseInt(cpf.substring(10, 11))) return false;
  return true;
}
