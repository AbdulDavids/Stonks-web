# Deployment Guide

## CORS Fix for Cloudflare Pages

This app uses a Cloudflare Pages Function to proxy API requests to the Stockly API, bypassing CORS restrictions.

### How It Works

1. **Development**: Vite proxy forwards `/api/*` requests to `https://stockly-api.vercel.app`
2. **Production**: Cloudflare Pages Function at `/functions/api/[[path]].ts` proxies requests server-side

### Files

- `/functions/api/[[path]].ts` - Cloudflare Pages Function that proxies API requests
- `/public/_headers` - CORS headers for API routes
- `/src/lib/api.ts` - API client configured to use `/api` endpoint

### Deploying to Cloudflare Pages

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Cloudflare Pages
3. Cloudflare Pages will automatically detect and deploy the function in `/functions`

The function will be available at `https://your-domain.com/api/*` and will proxy all requests to the Stockly API.

### Testing Locally

Run `npm run dev` to test with the Vite proxy in development mode.

