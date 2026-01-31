// functions/check.js

export async function onRequest(context) {
  const { request } = context;

  // Handle CORS Preflight for Browser
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method === "POST") {
    try {
      // 1. Get Data from Frontend
      const reqBody = await request.json();
      const cardData = reqBody.data;

      // 2. Prepare Python-like Headers (Spoofing)
      const targetHeaders = {
        'Authority': 'api.chkr.cc',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Content-Type': 'application/json; charset=UTF-8',
        'Origin': 'https://chkr.cc',           // <--- Critical
        'Referer': 'https://chkr.cc/',         // <--- Critical
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
      };

      // 3. Send Request to Real API
      const apiResponse = await fetch('https://api.chkr.cc/', {
        method: 'POST',
        headers: targetHeaders,
        body: JSON.stringify({
          "data": cardData,
          "charge": false
        })
      });

      // 4. Return result to Frontend
      const data = await apiResponse.json();
      
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
