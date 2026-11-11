// fetch() does not reject on 404/500, so the status is checked here.
// Returns unknown, so the caller has to validate the data.
export async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} responded with HTTP ${res.status}`);
  const data: unknown = await res.json();
  return data;
}
