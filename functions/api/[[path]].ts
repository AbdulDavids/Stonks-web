// Cloudflare Pages Function to proxy requests to Stockly API
// This bypasses CORS issues by making server-side requests

const STOCKLY_API_BASE = 'https://stockly-api.vercel.app';

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Extract the path after /api/
  const apiPath = url.pathname.replace(/^\/api/, '');
  
  // Build the target URL
  const targetUrl = `${STOCKLY_API_BASE}${apiPath}${url.search}`;
  
  try {
    // Forward the request to Stockly API
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Get the response data
    const data = await response.text();
    
    // Return response with CORS headers
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch from Stockly API',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

