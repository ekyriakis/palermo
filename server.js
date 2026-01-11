import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8081;
const PUBLIC_DIR = path.join(__dirname, 'public');

console.log(`📁 Public directory: ${PUBLIC_DIR}`);
console.log(`📂 Exists: ${fs.existsSync(PUBLIC_DIR)}`);

if (fs.existsSync(PUBLIC_DIR)) {
  const contents = fs.readdirSync(PUBLIC_DIR);
  console.log(`📄 Contents:`, contents);
}

const server = http.createServer((req, res) => {
  // Remove query strings and normalize URL
  let url = req.url.split('?')[0];
  if (url.endsWith('/') && url !== '/') url = url.slice(0, -1);
  
  // Map root to _expo/static entry
  if (url === '') url = '/';
  
  // Build file path
  let filePath = path.join(PUBLIC_DIR, url);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }
  
  // Try to serve the file
  try {
    const stat = fs.statSync(filePath);
    
    // If it's a directory, look for an index file
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    
    // Try to read the file
    const data = fs.readFileSync(filePath);
    
    // Determine MIME type
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
    };
    
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600',
    });
    res.end(data);
    
  } catch (err) {
    // File not found - serve public directory listing for debugging
    console.log(`Not found: ${filePath}`);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    
    // List directory contents for debugging
    try {
      const files = fs.readdirSync(PUBLIC_DIR);
      res.end(`
        <h1>404 - Not Found</h1>
        <p>Requested: ${url}</p>
        <p>Path: ${filePath}</p>
        <h2>Available files in ${PUBLIC_DIR}:</h2>
        <ul>
          ${files.map(f => `<li><a href="/${f}">${f}</a></li>`).join('')}
        </ul>
      `);
    } catch (e) {
      res.end('<h1>404 - Not Found</h1>');
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server ready at http://0.0.0.0:${PORT}`);
});
