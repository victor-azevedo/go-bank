import { BadRequestError } from "../src/errors";
import { addValueToBalance, dineroFromFloat, subtractValueToBalance } from "../src/utils/handle-currency";

describe("HandleCurrency", () => {
  describe("dineroFromFloat", () => {
    test("should return the correct dinero object", () => {
      const result = dineroFromFloat({ amountFloat: 10.5, currency: "USD" });
      expect(result.getAmount()).toBe(1050);
      expect(result.getCurrency()).toBe("USD");
    });
  });

  describe("addValueToBalance", () => {
    test("should add value to balance correctly", () => {
      const result = addValueToBalance({ balanceFloat: 100, valueFloat: 50 });
      expect(result).toBe(150);
    });
  });

  describe("subtractValueToBalance", () => {
    test("should subtract value from balance correctly", () => {
      const result = subtractValueToBalance({ balanceFloat: 100, valueFloat: 50 });
      expect(result).toBe(50);
    });

    test("should subtract value from equal balance correctly", () => {
      const result = subtractValueToBalance({ balanceFloat: 100, valueFloat: 100 });
      expect(result).toBe(0);
    });

    test("should throw BadRequestError if balance is less than value", () => {
      expect(() => {
        subtractValueToBalance({ balanceFloat: 50, valueFloat: 50.01 });
      }).toThrow(BadRequestError);
    });
  });
});
