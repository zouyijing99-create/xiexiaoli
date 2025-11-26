const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

function sendJSON(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body);
}

async function handleChat(req, res) {
  try {
    if (!process.env.DASHSCOPE_API_KEY) {
      return sendJSON(res, 500, { error: 'Missing DASHSCOPE_API_KEY' });
    }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      let payload = {};
      try { payload = JSON.parse(body || '{}'); } catch {}
      const { messages, model, temperature, max_tokens, enable_thinking } = payload;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return sendJSON(res, 400, { error: 'messages required' });
      }
  const API_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
  const apiResp = await fetch(API_BASE_URL + '/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model || 'qwen-flash-2025-07-28',
          messages,
          temperature: typeof temperature === 'number' ? temperature : 0.7,
          max_tokens: typeof max_tokens === 'number' ? max_tokens : 1024,
          enable_thinking: !!enable_thinking
        })
      });
      if (!apiResp.ok) {
        return sendJSON(res, 500, { error: 'Chat API call failed' });
      }
      const data = await apiResp.json();
      const choice = data.choices && data.choices[0];
      const content = choice && (choice.message?.content || choice.delta?.content) || '';
      const reasoning = choice && (choice.message?.reasoning_content || choice.delta?.reasoning_content) || '';
      return sendJSON(res, 200, { content, reasoning });
    });
  } catch (e) {
    return sendJSON(res, 500, { error: 'Server error' });
  }
}

function serveStatic(req, res) {
  const parsed = url.parse(req.url);
  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(__dirname, pathname);
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.json': 'application/json; charset=utf-8'
    };
    const contentType = types[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url);
  if (req.method === 'POST' && parsed.pathname === '/api/chat') {
    return handleChat(req, res);
  }
  return serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

