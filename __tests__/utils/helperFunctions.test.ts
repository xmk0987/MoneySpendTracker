import {
  capitalizeFirstLetter,
  normalizeReceiver,
} from "@/utils/helperFunctions";
import { describe, expect, test } from "@jest/globals";

describe("Helper functions from utils", () => {
  describe("capitalizeFirstLetter", () => {
    test("it capitalizes the first letter of an all-lowercase string", () => {
      const testStr = "hello world";
      expect(capitalizeFirstLetter(testStr)).toBe("Hello world");
    });

    test("it handles an empty string", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });

    test("it handles a string with leading spaces", () => {
      expect(capitalizeFirstLetter("  hello")).toBe("  Hello");
    });

    test("it handles a string with uppercase first letter", () => {
      expect(capitalizeFirstLetter("Hello")).toBe("Hello");
    });

    test("it does not capitalize string if it has numbers before string", () => {
      expect(capitalizeFirstLetter("3232hello")).toBe("3232hello");
    });

    test("it does not capitalize string if it has characters before string", () => {
      expect(capitalizeFirstLetter("@!hello")).toBe("@!hello");
    });
  });

  describe("normalizeReceiver", () => {
    test("it normalizes the receiver correctly separated with .", () => {
      const receiver = " John.Doe ";
      expect(normalizeReceiver(receiver)).toBe("john doe");
    });

    test("it normalizes the receiver correctly separated with ' '", () => {
      const receiver = " John Doe ";
      expect(normalizeReceiver(receiver)).toBe("john doe");
    });

    test("it normalizes receiver with multiple special characters", () => {
      const receiver = " John.!?@ Doe# ";
      expect(normalizeReceiver(receiver)).toBe("john doe");
    });

    test("it normalizes the receiver that contains numbers correctly", () => {
      const receiver = " John43Doe444 ";
      expect(normalizeReceiver(receiver)).toBe("john doe");
    });

    test("it normalizes the receiver correctly when it contains numbers and special characters", () => {
      const receiver = " John.Doe - 888";
      expect(normalizeReceiver(receiver)).toBe("john doe");
    });
  });
});
