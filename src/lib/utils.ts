import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// lib/utils.ts
export function generateOrderReference(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit number
  return `ORDER-${randomNum}`;
}

// lib/utils.ts
export function generatePaymentReference(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `PAY-${randomNum}`;
}

