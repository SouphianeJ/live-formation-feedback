export function isValidEmail(value: string): boolean {
  return /.+@.+\..+/.test(value.trim());
}

export function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required`);
  }
  return value.trim();
}

export function requireNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${label} must be a number`);
  }
  return value;
}

export function requireArray<T>(value: unknown, label: string): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array`);
  }
  return value as T[];
}
