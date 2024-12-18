import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simplified utility function for merging class names
export function mergeClassNames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}