const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwT-jYjnQuxGRrOCafLH94otxgMxi9BVQhdq58RwmcSFHbGkDus0gp7pOjtXE1Tp5GHLA/exec';

exports.handler = async function(event) {
  try {
    if (event.httpMethod === 'POST') {
      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: event.body || '{}'
      });

      return {
        statusCode: 200,
        headers: jsonHeaders(),
        body: JSON.stringify({ ok: response.ok })
      };
    }

    const callback = 'netlifySheetsCallback';
    const response = await fetch(`${GOOGLE_SHEETS_URL}?action=list&callback=${callback}&t=${Date.now()}`);
    const text = await response.text();
    const match = text.match(/^netlifySheetsCallback\(([\s\S]*)\);?$/);
    const rows = match ? JSON.parse(match[1]) : [];

    return {
      statusCode: 200,
      headers: jsonHeaders(),
      body: JSON.stringify(Array.isArray(rows) ? rows : [])
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: jsonHeaders(),
      body: JSON.stringify([])
    };
  }
};

function jsonHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  };
}
