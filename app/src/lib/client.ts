export async function fetchJson<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  const data = (await response.json()) as T;
  if (!response.ok) {
    const message = (data as { error?: string }).error || "Erreur";
    throw new Error(message);
  }
  return data;
}
