import Dinero from "dinero.js";
import { BadRequestError } from "../errors";

interface DineroFromFloat {
  amountFloat: number;
  currency?: Dinero.Currency;
  factor?: number;
}

export const CURRENCY_PRECISION = 2;
export const CURRENCY_BASE = 10;
export const CURRENCY_FATOR = CURRENCY_BASE ** CURRENCY_PRECISION;

export function dineroFromFloat({ amountFloat, currency = "BRL", factor = CURRENCY_FATOR }: DineroFromFloat) {
  const amount = Math.round(amountFloat * factor);
  return Dinero({ amount, currency });
}

interface BalanceOperation {
  balanceFloat: number;
  valueFloat: number;
}

export function addValueToBalance({ balanceFloat, valueFloat }: BalanceOperation) {
  const balanceCurrency = dineroFromFloat({ amountFloat: balanceFloat });
  const valueCurrency = dineroFromFloat({ amountFloat: valueFloat });

  return balanceCurrency.add(valueCurrency).toUnit();
}

export function subtractValueToBalance({ balanceFloat, valueFloat }: BalanceOperation) {
  const balanceCurrency = dineroFromFloat({ amountFloat: balanceFloat });
  const valueCurrency = dineroFromFloat({ amountFloat: valueFloat });

  if (balanceCurrency.lessThan(valueCurrency)) throw new BadRequestError("Insufficient balance");

  return balanceCurrency.subtract(valueCurrency).toUnit();
}
