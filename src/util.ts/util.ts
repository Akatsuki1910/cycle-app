export const round = (n: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.round(n * factor) / factor;
};

export interface Geo {
  lat: number;
  lon: number;
  altitude: number | null;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  timestamp: number;
}

export const rgbToCssColor = (
  red: number = 0,
  green: number = 0,
  blue: number = 0
) => {
  red *= 100;
  green *= 100;
  blue *= 100;
  const rgbNumber = new Number((red << 16) | (green << 8) | blue);
  const hexString = rgbNumber.toString(16);
  const missingZeros = 6 - hexString.length;
  const resultBuilder = ["#"];
  for (var i = 0; i < missingZeros; i++) {
    resultBuilder.push("0");
  }
  resultBuilder.push(hexString);
  return resultBuilder.join("");
};

export const getCssStyle = (style: Record<string, unknown>) =>
  Object.entries(style)
    .map((v) => `${v[0]}: ${v[1]}`)
    .join("; ");
