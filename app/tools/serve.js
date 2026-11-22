const http = require('http');
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..');
const home = process.env.BUZZWORKS_HOME || path.join(appDir, '..');
const dataDir = path.join(home, 'data');
const logDir = path.join(home, 'logs');
const port = Number(process.env.PORT) || 5190;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const allowed = new Set(['save', 'settings']);

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(logDir, { recursive: true });

function logFile() {
  const d = new Date();
  return path.join(logDir, 'buzzworks-' + d.toISOString().slice(0, 10) + '.log');
}
function log(line) {
  fs.appendFile(logFile(), line + '\n', () => {});
}

function readBody(req, cb) {
  const chunks = [];
  let size = 0;
  req.on('data', c => { size += c.length; if (size < 5e6) chunks.push(c); });
  req.on('end', () => cb(Buffer.concat(chunks).toString('utf8')));
}

let lastHit = Date.now();
if (process.env.BUZZWORKS_AUTOEXIT) setInterval(() => { if (Date.now() - lastHit > 300000) process.exit(0); }, 30000);

http.createServer((req, res) => {
  lastHit = Date.now();
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/api/ping') { res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end('{"ok":true}'); return; }
  if (url === '/api/log' && req.method === 'POST') {
    readBody(req, body => { fs.appendFile(logFile(), body + '\n', () => {}); res.writeHead(204); res.end(); });
    return;
  }
  const m = url.match(/^\/api\/data\/([a-z]+)$/);
  if (m && allowed.has(m[1])) {
    const file = path.join(dataDir, m[1] + '.json');
    if (req.method === 'POST') {
      readBody(req, body => {
        if (!body) { fs.rm(file, { force: true }, () => { res.writeHead(204); res.end(); }); return; }
        try { JSON.parse(body); } catch (e) { res.writeHead(400); res.end(); return; }
        const tmp = file + '.tmp';
        fs.writeFile(tmp, body, err => {
          if (err) { res.writeHead(500); res.end(); return; }
          fs.rename(tmp, file, err2 => { res.writeHead(err2 ? 500 : 204); res.end(); });
        });
      });
    } else {
      fs.readFile(file, 'utf8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(err ? '' : data);
      });
    }
    return;
  }
  const file = path.normalize(path.join(appDir, url === '/' ? 'index.html' : url));
  if (!file.startsWith(appDir) || file.includes(path.sep + 'tools' + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => {
  log(new Date().toISOString() + ' [info] server started on port ' + port);
  console.log('Buzzworks running at http://localhost:' + port);
});
