// 経歴表示における年齢の計算方法
// 生年を0歳とする
// 早生まれ、年度、月の比較は行わない
// （例）
// 1975年12月生まれ：経歴開始1982年4月→7歳

import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import { History } from "../models/History";
import { historyColors } from "./constants";

// 1976年2月生まれ：経歴開始1982年4月→6歳
export function calcAge(birthYear: number, targetYear: number) {
  return targetYear - birthYear;
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

  // 経歴の開始年月の場合は濃い色、それ以外は薄い色
  const color = getHistoryColor(index);
  const start = dayjs(histories[index].start);
  return target.isSame(start, "month") ? `${color}.400` : `${color}.200`;
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
