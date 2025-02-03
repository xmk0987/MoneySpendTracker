import { capitalizeFirstLetter } from "@/utils/stringSimilarity";
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
});
