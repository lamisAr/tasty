// encodeDecode.ts

const textToChars = (text: string): number[] => text.split("").map((c) => c.charCodeAt(0));
const byteHex = (n: number): string => `0${Number(n).toString(16)}`.substr(-2);

/* eslint-disable-next-line no-bitwise */
const applySaltToChar = (salt: string, code: number): number => textToChars(salt).reduce((a, b) => a ^ b, code);

export const encode = (salt: string, text: string): string =>
  text
    .split("")
    .map((c) => c.charCodeAt(0))
    .map((code) => applySaltToChar(salt, code))
    .map(byteHex)
    .join("");

export const decode = (salt: string, encoded: string): string => {
  // Match returns null if no matches are found, so handle this case
  const matches = encoded.match(/.{1,2}/g);

  if (!matches) {
    // Handle the case where no matches were found, e.g., return an empty string or throw an error
    return "";
  }

  return matches
    .map((hex) => parseInt(hex, 16))
    .map((code) => applySaltToChar(salt, code))
    .map((charCode) => String.fromCharCode(charCode))
    .join("");
};
