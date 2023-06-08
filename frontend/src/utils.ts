export const isPositive = (str) => {
  return Math.sign(Number.parseFloat(str)) >= 0;
};

export const showValueWithSign = (str, prefix = "$"): string => {
  return Math.sign(Number.parseFloat(str)) >= 0
    ? `+${prefix}${showValueWithComma(str)}`
    : `-${prefix}${showValueWithComma(Math.abs(str))}`;
};

export const showValueWithComma = (str, short = false): string => {
  if (short && Math.abs(Number.parseFloat(str)) >= 1000) {
    return Number.parseFloat((Number.parseFloat(str) / 1000).toFixed(1)).toLocaleString() + "K";
  }
  return Number.parseFloat(Number.parseFloat(str).toFixed(2)).toLocaleString();
};

export const dateStrToTimestamp = (str: string): number => {
  // '2021-10-06T13:30:15.312Z' -> 1633527015
  return Math.round(new Date(str).getTime() / 1000);
};

export const timestampToDate = (ts: number): string => {
  // 1633527015 -> '07/10/2021'
  return new Date(ts * 1000).toLocaleDateString();
};

export const getChangePercentage = (total: number, change: number): number => {
  return (change / (total - change)) * 100;
};
