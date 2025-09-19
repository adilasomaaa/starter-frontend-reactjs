function getEnv(key: string, fallback?: string): string {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  if (value === undefined || value === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  apiUrl: getEnv("VITE_API_URL", "http://localhost:3000/api"),
  baseUrl: getEnv("VITE_BASE_URL", "http://localhost:3000/"),
  nodeEnv: getEnv("MODE", "development"),
};
