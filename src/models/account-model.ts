import mongoose, { ObjectId } from "mongoose";

export interface Account {
  userId: ObjectId;
  accountNumber: number;
  balance: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AccountDocument extends Account, mongoose.Document {}

const accountSchema: mongoose.Schema<AccountDocument> = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  accountNumber: {
    type: Number,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
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
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

accountSchema.pre<AccountDocument>("save", async function (next) {
  if (!this.accountNumber) {
    this.accountNumber = await getNextAccountNumber();
  }
  next();
});

async function getNextAccountNumber(): Promise<number> {
  const lastAccount = await accountModel.findOne({}, {}, { sort: { accountNumber: -1 } });
  if (lastAccount) {
    return lastAccount.accountNumber + 1;
  } else {
    return 1;
  }
}

export const accountModel = mongoose.model<AccountDocument>("AccountModel", accountSchema);
