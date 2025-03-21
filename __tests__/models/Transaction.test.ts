import TransactionModel from "@/models/TransactionModel";
import {
  invalidDateCreated,
  invalidTotal,
  validTransaction,
} from "../../mockData";
import { describe, expect, test } from "@jest/globals";

describe("Transaction", () => {
  describe("tryCreate", () => {
    test("it handles valid Transaction", () => {
      const transaction = TransactionModel.tryCreate(validTransaction);
      expect(transaction).not.toBeNull();

      const expectedTransaction = {
        dateCreated: new Date("2025-01-21T22:00:00.000Z"),
        total: -9.15,
        sender: "ONNI VITIKAINEN",
        receiverNameOrTitle: "GROCERY STORE",
      };

      expect(transaction).toEqual(expectedTransaction);
    });

    test("it handles invalid date created", () => {
      const transaction = TransactionModel.tryCreate(invalidDateCreated);
      expect(transaction).toBeNull();
    });

    test("it handles invalid total", () => {
      const transaction = TransactionModel.tryCreate(invalidTotal);
      expect(transaction).toBeNull();
    });
  });
});
