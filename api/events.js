const { put, list } = require('@vercel/blob');

const BLOB_FILENAME = 'events.json';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  // GET — read events from blob
  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: BLOB_FILENAME });
      if (blobs.length === 0) {
        res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ events: [] }));
      }
      const blobUrl = blobs[0].url;
      const response = await fetch(blobUrl);
      const data = await response.text();
      res.writeHead(200, {
        ...CORS_HEADERS,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      });
      return res.end(data);
    } catch (error) {
      console.error('GET /api/events error:', error);
      res.writeHead(500, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Failed to read events' }));
    }
  }

  // PUT — write events to blob (requires admin auth)
  if (req.method === 'PUT') {
    try {
      const { events, passHash } = req.body;

      if (!passHash || passHash !== process.env.ADMIN_PASS_HASH) {
        res.writeHead(401, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Unauthorized' }));
      }

      if (!events || !Array.isArray(events)) {
        res.writeHead(400, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid events data' }));
      }

      const content = JSON.stringify({ events }, null, 2);
      await put(BLOB_FILENAME, content, {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
      });

      res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true }));
    } catch (error) {
      console.error('PUT /api/events error:', error);
      res.writeHead(500, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Failed to write events' }));
    }
  }

  res.writeHead(405, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({ error: 'Method not allowed' }));
};
