// Cloudflare Worker for nrth.no. Kjøres bare for /api/* (run_worker_first i wrangler.jsonc).
// Alt annet er statiske filer, med videresendinger fra _redirects og headere fra _headers.
import book from '../api/book.js';
import inquiry from '../api/inquiry.js';
import services from '../api/services.js';
import { runVercelHandler } from './vercel.js';

const ROUTES = {
  '/api/book': book,
  '/api/inquiry': inquiry,
  '/api/services': services,
};

// _headers gjelder ikke svar fra Worker-koden. På Vercel får api/ de samme
// sikkerhetsheaderne som resten av siden (vercel.json), så de settes her.
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const handler = ROUTES[pathname];
    // Ukjente adresser under /api/ får 404-siden fra de statiske filene
    if (!handler) return env.ASSETS.fetch(request);

    let response;
    try {
      response = await runVercelHandler(handler, request);
    } catch (err) {
      console.error(`Unhandled error (${pathname}):`, err);
      response = Response.json({ error: 'Internal server error' }, { status: 500 });
    }
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) response.headers.set(name, value);
    return response;
  },
};
