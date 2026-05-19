import { randomInt } from "node:crypto";

const LOWER = "abcdefghijkmnpqrstuvwxyz";
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const DIGIT = "23456789";
const SYMBOL = "!@#$%^&*-_=+";
const ALL = LOWER + UPPER + DIGIT + SYMBOL;

function pick(charset: string): string {
  return charset[randomInt(0, charset.length)];
}

function shuffle(input: string): string {
  const arr = input.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

export function generateStrongPassword(length = 16): string {
  if (length < 12) length = 12;
  const required = pick(LOWER) + pick(UPPER) + pick(DIGIT) + pick(SYMBOL);
  let rest = "";
  for (let i = 0; i < length - required.length; i++) rest += pick(ALL);
  return shuffle(required + rest);
}
