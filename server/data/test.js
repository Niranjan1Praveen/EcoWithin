// Cloudflare Worker Script
export default {
  async fetch(request) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, X-Client-Info',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      const url = new URL(request.url);
      
      // Your Supabase project reference
      const supabaseProjectRef = 'hpumegppcvjhxgkavawh';
      const supabaseHost = `db.${supabaseProjectRef}.supabase.co`;
      
      // Construct the Supabase URL
      const supabaseUrl = `https://${supabaseHost}${url.pathname}${url.search}`;
      
      console.log(`Proxying request to: ${supabaseUrl}`);

      // Clone the request to modify headers
      const modifiedRequest = new Request(supabaseUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        // Important: don't follow redirects automatically
        redirect: 'manual',
      });

      // Forward the request to Supabase
      const response = await fetch(modifiedRequest);

      // Create a new response with CORS headers
      const modifiedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });

      // Add CORS headers
      modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
      modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, X-Client-Info');

      return modifiedResponse;
      
    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(JSON.stringify({
        error: 'Proxy error',
        message: error.message,
        solution: 'Unable to reach Supabase through proxy'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};