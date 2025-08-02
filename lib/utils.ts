import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export { apiFetch, clearTokenCache } from "./api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
