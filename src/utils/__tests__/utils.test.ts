import dayjs from "dayjs";
import {
  calcAge,
  calcMiddleMonth,
  findHistoriesByYear,
  findHistoryIndex,
  getBackgroundColor,
  validateEmail,
} from "../utils";
import { History } from "../../models/History";

// test data
const histories: History[] = [
  {
    id: "1",
    title: "経歴1",
    start: new Date("2020-01-01"),
    end: new Date("2021-06-30"),
    createdAt: new Date("2021-01-01"),
    updatedAt: new Date("2021-07-01"),
  },
  {
    id: "2",
    title: "経歴2",
    start: new Date("2021-08-01"),
    end: new Date("2022-02-28"),
    createdAt: new Date("2021-08-01"),
    updatedAt: new Date("2021-08-01"),
  },
  {
    id: "3",
    title: "経歴3",
    start: new Date("2022-04-01"),
    end: new Date("2022-06-30"),
    createdAt: new Date("2022-04-01"),
    updatedAt: new Date("2023-04-01"),
  },
  {
    id: "4",
    title: "経歴4",
    start: new Date("2022-07-01"),
    end: new Date("2022-10-31"),
    createdAt: new Date("2022-08-01"),
    updatedAt: new Date("2022-08-01"),
  },
  {
    id: "5",
    title: "経歴5",
    start: new Date("2022-11-01"),
    end: undefined,
    createdAt: new Date("2022-12-01"),
    updatedAt: new Date("2023-04-01"),
  },
];

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

describe("calcMiddleMonth", () => {
  test("同一年月", () => {
    const start = dayjs("2020-01-01");
    const end = dayjs("2020-01-31");
    expect(calcMiddleMonth(start, end).format("YYYY-MM")).toBe("2020-01");
  });
  test("同一の年", () => {
    const start = dayjs("2020-01-01");
    const end = dayjs("2020-11-30");
    expect(calcMiddleMonth(start, end).format("YYYY-MM")).toBe("2020-06");
  });
  test("同一の年（0.5は切り捨て）", () => {
    const start = dayjs("2020-01-01");
    const end = dayjs("2020-12-31");
    expect(calcMiddleMonth(start, end).format("YYYY-MM")).toBe("2020-06");
  });
  test("end > start", () => {
    const start = dayjs("2021-02-01");
    const end = dayjs("2020-12-01");
    expect(calcMiddleMonth(start, end).format("YYYY-MM")).toBe("2021-01");
  });
  test("end > start（0.5は切り捨て）", () => {
    const start = dayjs("2021-03-01");
    const end = dayjs("2020-12-31");
    expect(calcMiddleMonth(start, end).format("YYYY-MM")).toBe("2021-01");
  });
});

describe("findHistoryIndex", () => {
  test("該当なし（経歴1より前）", () => {
    const target = dayjs("2019-12-31");
    expect(findHistoryIndex(histories, target)).toBe(-1);
  });
  test("該当あり（経歴1の開始月）", () => {
    const target = dayjs("2020-01-01");
    expect(findHistoryIndex(histories, target)).toBe(0);
  });
  test("該当あり（経歴1の終了月）", () => {
    const target = dayjs("2021-06-30");
    expect(findHistoryIndex(histories, target)).toBe(0);
  });
  test("該当なし（経歴1と2の間）", () => {
    const target = dayjs("2021-07-01");
    expect(findHistoryIndex(histories, target)).toBe(-1);
  });
  test("該当あり（経歴2の開始月）", () => {
    const target = dayjs("2021-08-01");
    expect(findHistoryIndex(histories, target)).toBe(1);
  });
  test("該当あり（経歴5 現在進行中）", () => {
    const target = dayjs();
    expect(findHistoryIndex(histories, target)).toBe(4);
  });
});

describe("findHistoriesByYear", () => {
  test("該当なし（経歴1より前）", () => {
    const target = 2019;
    expect(findHistoriesByYear(histories, target)).toEqual([]);
  });
  test("該当あり（経歴1の重心）", () => {
    const target = 2020;
    expect(findHistoriesByYear(histories, target)).toEqual([histories[0]]);
  });
  test("該当あり（経歴2の重心）", () => {
    const target = 2021;
    expect(findHistoriesByYear(histories, target)).toEqual([histories[1]]);
  });
  test("該当あり（経歴3、4の重心）", () => {
    const target = 2022;
    expect(findHistoriesByYear(histories, target)).toEqual([
      histories[2],
      histories[3],
    ]);
  });
  test("該当あり（経歴5の重心）", () => {
    const middle = calcMiddleMonth(dayjs(histories[4].start), dayjs());
    expect(findHistoriesByYear(histories, middle.year())).toEqual([
      histories[4],
    ]);
  });
});

describe("getBackgroundColor", () => {
  const birthYearMonth = dayjs("1998-12-01");
  test("生年月以前", () => {
    const target = dayjs("1998-11-30");
    expect(getBackgroundColor(histories, birthYearMonth, target)).toBe(
      "gray.200"
    );
  });
  test("生年月", () => {
    const target = dayjs("1998-12-31");
    expect(getBackgroundColor(histories, birthYearMonth, target)).toBe(
      "red.400"
    );
  });
  test("現在年月", () => {
    const target = dayjs();
    expect(getBackgroundColor(histories, birthYearMonth, target)).toBe(
      "red.400"
    );
  });
  test("未来", () => {
    const target = dayjs().add(1, "month");
    expect(getBackgroundColor(histories, birthYearMonth, target)).toBe("white");
  });
  test("経歴1", () => {
    const target = dayjs("2020-01-01");
    expect(getBackgroundColor(histories, birthYearMonth, target)).toBe(
      "yellow.200"
    );
  });
  test("経歴1と2の間", () => {
    const target = dayjs("2021-07-01");
    expect(getBackgroundColor(histories, birthYearMonth, target)).toBe("white");
  });
  test("経歴3", () => {
    const target = dayjs("2022-06-01");
    expect(getBackgroundColor(histories, birthYearMonth, target)).toBe(
      "orange.200"
    );
  });
});

describe("validateEmail", () => {
  test("正しいメールアドレス", () => {
    expect(validateEmail("a@b.cc")).toBeTruthy();
  });
  test("不正なメールアドレス . なし", () => {
    expect(validateEmail("a@b")).toBeFalsy();
  });
  test("不正なメールアドレス @ なし", () => {
    expect(validateEmail("ab.cc")).toBeFalsy();
  });
  test("不正なメールアドレス @@ ", () => {
    expect(validateEmail("a@@b.cc")).toBeFalsy();
  });
  test("不正なメールアドレス 空文字", () => {
    expect(validateEmail("")).toBeFalsy();
  });
  test("不正なメールアドレス >320文字", () => {
    expect(
      validateEmail(
        "a".repeat(64) + "@" + "b".repeat(253) + "." + "c".repeat(2)
      )
    ).toBeFalsy();
  });
  test("不正なメールアドレス ローカルが長い", () => {
    expect(validateEmail("a".repeat(65) + "@b.cc")).toBeFalsy();
  });
  test("不正なメールアドレス ドメインが長い", () => {
    expect(validateEmail("a@b." + "c".repeat(254))).toBeFalsy();
  });
});
