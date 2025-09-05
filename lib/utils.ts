import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// helper untuk menggabungkan class tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
