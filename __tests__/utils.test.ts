import { calcAge } from "../src/utils/utils";

describe("calcAge", () => {
  test("年齢 > 0歳", () => {
    expect(calcAge(1976, 2024)).toBe(48);
  });
  test("年齢 = 0歳", () => {
    expect(calcAge(2020, 2020)).toBe(0);
  });
  test("年齢 < 0歳", () => {
    expect(calcAge(2024, 1976)).toBe(-48);
  });
});
