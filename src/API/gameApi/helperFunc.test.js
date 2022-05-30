import { arrayMatch, isInRange } from "./helperFunc";

describe("Helper functions test", () => {
  describe("arrayMatch should", () => {
    let testArr1, testArr2;
    beforeEach(() => {
      testArr1 = [1, 2, 3];
      testArr2 = [4, 5, 6];
    });
    test("return true when passed identical references", () => {
      expect(arrayMatch(testArr1, testArr1)).toBe(true);
    });

    test("return true when passes arrays with same elements", () => {
      expect(arrayMatch(testArr1, [1, 2, 3])).toBe(true);
      expect(arrayMatch(testArr2, [4, 5, 6])).toBe(true);
    });

    test("return false when passed different arrays", () => {
      expect(arrayMatch(testArr1, testArr2)).toBe(false);
    });

    test("return false when called with invalid arguments", () => {
      expect(arrayMatch(1, { a: 1 })).toBe(false);
    });
  });

  describe("isInRange should", () => {
    test("return true when called with an integer in range", () => {
      expect(isInRange(5, 0, 10)).toBe(true);
      expect(isInRange(5, 5, 10)).toBe(true);
      expect(isInRange(10, 0, 10)).toBe(true);
    });
    test("return false when numbers out of range", () => {
      expect(isInRange(10, 0, 9)).toBe(false);
      expect(isInRange(-10, 0, 9)).toBe(false);
    });

    test("return false when called with invalid arguments", () => {
      expect(isInRange("4", 0, 5)).toBe(false);
      expect(isInRange("4", "s", [8])).toBe(false);
      expect(isInRange(4, "s", [8])).toBe(false);
    });
  });
});
