// Kjører en Vercel-funksjon fra api/ på Cloudflare Workers.
// Funksjonene er skrevet som handler(req, res) for Vercel. Her lages req og res av
// Request fra Cloudflare, og svaret gjøres om til en Response. Slik kan samme kode
// kjøre på begge steder mens nrth.no flyttes.

// Vercel tolker kroppen ut fra Content-Type: JSON og skjemadata blir objekter, tekst blir
// en streng. Ugyldig JSON kaster når req.body leses, og det håndterer readBody i api/_lib/form.js.
async function parseBody(request) {
  if (request.method === 'GET' || request.method === 'HEAD') return () => undefined;
  const type = (request.headers.get('content-type') || '').toLowerCase();
  const text = await request.text();
  if (!text) return () => undefined;
  if (type.startsWith('application/json')) {
    let parsed;
    try {
      parsed = { value: JSON.parse(text) };
    } catch (err) {
      parsed = { error: err };
    }
    return () => {
      if (parsed.error) throw parsed.error;
      return parsed.value;
    };
  }
  if (type.startsWith('application/x-www-form-urlencoded')) {
    const value = Object.fromEntries(new URLSearchParams(text));
    return () => value;
  }
  if (type.startsWith('text/')) return () => text;
  return () => undefined;
}

export async function runVercelHandler(handler, request) {
  const url = new URL(request.url);
  const getBody = await parseBody(request);

  const req = {
    method: request.method,
    url: url.pathname + url.search,
    headers: Object.fromEntries(request.headers),
    query: Object.fromEntries(url.searchParams),
  };
  Object.defineProperty(req, 'body', { get: getBody, enumerable: true });

  const headers = new Headers();
  let status = 200;
  let body = null;

  const res = {
    setHeader(name, value) {
      headers.set(name, String(value));
      return res;
    },
    getHeader(name) {
      return headers.get(name) ?? undefined;
    },
    status(code) {
      status = code;
      return res;
    },
    json(data) {
      if (!headers.has('content-type')) headers.set('content-type', 'application/json; charset=utf-8');
      body = JSON.stringify(data);
      return res;
    },
    send(data) {
      if (data !== null && typeof data === 'object') return res.json(data);
      if (!headers.has('content-type')) headers.set('content-type', 'text/html; charset=utf-8');
      body = data == null ? null : String(data);
      return res;
    },
    end(data) {
      body = data == null ? null : data;
      return res;
    },
  };

  await handler(req, res);

  // HEAD og statuskoder uten innhold kan ikke ha kropp i en Response
  const empty = request.method === 'HEAD' || status === 204 || status === 304;
  return new Response(empty ? null : body, { status, headers });
}
