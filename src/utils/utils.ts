import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import { History } from "../models/History";
import { historyColors } from "./constants";

// 経歴表示における年齢の計算方法
// 生年を0歳とする
// 早生まれ、年度、月の比較は行わない
// （例）
// 1975年12月生まれ：経歴開始1982年4月→7歳
// 1976年2月生まれ：経歴開始1982年4月→6歳
export function calcAge(birthYear: number, targetYear: number) {
  return targetYear - birthYear;
}

// 2つの年月の真ん中を返す
export function calcMiddleMonth(m1: Dayjs, m2: Dayjs) {
  // 開始年月、終了年月を判定
  const [start, end] = m1.isBefore(m2) ? [m1, m2] : [m2, m1];
  const diff = end.endOf("month").diff(start.startOf("month"), "month");
  return start.add(diff / 2, "month");
}

// 指定された年月が該当する経歴一覧のインデックスを返す
export function findHistoryIndex(histories: History[], target: Dayjs) {
  return histories.findIndex((history) => {
    // 経歴の開始年月と終了年月を取得
    const start = dayjs(history.start);
    const end = dayjs(history.end);
    // 経歴の開始年月と終了年月の範囲に含まれるか判定
    return target.isBetween(start, end, "month", "[]");
  });
}

// 指定した年に経歴の重心があれば返す
export function findHistoriesByYear(histories: History[], year: number) {
  const start = dayjs().year(year).startOf("year");
  const end = dayjs().year(year).endOf("year");
  return histories.filter((history) => {
    // 経歴の開始年月と終了年月の真ん中を重心とする
    const middleMonth = calcMiddleMonth(
      dayjs(history.start),
      dayjs(history.end)
    );
    return middleMonth.isBetween(start, end, "month", "[]");
  });
}

// 経歴のインデックスに応じて背景色を返す
function getHistoryColor(index: number) {
  if (index == -1) {
    return "white";
  }
  const colorIndex = index % historyColors.length;
  return historyColors[colorIndex];
}

export function getBackgroundColor(
  histories: History[],
  birthYearMonth: Dayjs,
  target: Dayjs
) {
  const now = dayjs();

  // 生年月以前の場合
  if (target.isBefore(birthYearMonth, "month")) {
    return "gray.200";
  }
  // 生年月の場合
  if (target.isSame(birthYearMonth, "month")) {
    return "red.400";
  }
  // 現在年月の場合
  if (target.isSame(now, "month")) {
    return "red.400";
  }
  // 未来の場合
  if (target.isAfter(now, "month")) {
    return "white";
  }

  // どの経歴の範囲に含まれるか
  const index = findHistoryIndex(histories, target);
  if (index == -1) {
    return "white";
  }

  const color = getHistoryColor(index);
  return `${color}.200`;
}

// メールアドレスのバリデーション
export function validateEmail(email: string) {
  if (email.length > 320) {
    return false;
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return false;
  }

  const [local, domain] = parts;
  const localMaxLength = 64;
  const domainMaxLength = 255;
  if (local.length > localMaxLength || domain.length > domainMaxLength) {
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  return true;
}
