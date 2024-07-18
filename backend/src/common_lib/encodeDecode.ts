// encodeDecode.ts

const textToChars = (text: string): number[] => text.split("").map((c) => c.charCodeAt(0));
const byteHex = (n: number): string => ("0" + Number(n).toString(16)).substr(-2);

const applySaltToChar = (salt: string, code: number): number => {
  return textToChars(salt).reduce((a, b) => a ^ b, code);
};

export const encode = (salt: string, text: string): string => {
  return text
    .split("")
    .map((c) => c.charCodeAt(0))
    .map((code) => applySaltToChar(salt, code))
    .map(byteHex)
    .join("");
};

export const decode = (salt: string, encoded: string): string => {
  return encoded
    .match(/.{1,2}/g)!
    .map((hex) => parseInt(hex, 16))
    .map((code) => applySaltToChar(salt, code))
    .map((charCode) => String.fromCharCode(charCode))
    .join("");
};
