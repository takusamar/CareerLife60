// 経歴表示における年齢の計算方法
// 生年を0歳とする
// 早生まれ、年度、月の比較は行わない
// （例）
// 1975年12月生まれ：経歴開始1982年4月→7歳
// 1976年2月生まれ：経歴開始1982年4月→6歳
export function calcAge(birthYear: number, targetYear: number) {
  return targetYear - birthYear;
}
