// utils/auth.ts
export function isTokenAvailable(): boolean {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("userFeudjoToken");
    return !!token;
}
  