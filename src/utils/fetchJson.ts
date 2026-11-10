// fetch() only rejects on network failure; a 404/500 resolves normally, so
// the status has to be checked before the body is parsed as JSON.
// res.json() is typed any; returning unknown forces every caller to
// validate the data before it can be used as a domain type.
export async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} responded with HTTP ${res.status}`);
  const data: unknown = await res.json();
  return data;
}
