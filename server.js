import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8081;
const PUBLIC_DIR = path.join(__dirname, 'public');

console.log(`📁 Serving files from: ${PUBLIC_DIR}`);
console.log(`📂 Directory exists: ${fs.existsSync(PUBLIC_DIR)}`);

if (fs.existsSync(PUBLIC_DIR)) {
  console.log(`📄 Files in public directory:`, fs.readdirSync(PUBLIC_DIR).slice(0, 10));
}

const server = http.createServer((req, res) => {
  // Remove query strings
  const url = req.url.split('?')[0];
  
  // Default to index.html for root
  let filePath = url === '/' ? '/index.html' : url;
  filePath = path.join(PUBLIC_DIR, filePath);
  
  // Normalize path to prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }
  
  // Check if file exists
  let fileExists = false;
  try {
    fileExists = fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch (e) {
    // File doesn't exist
  }
  
  // If file doesn't exist, serve index.html (SPA routing)
  if (!fileExists) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }
  
  // Set proper MIME types
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
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
  
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(`❌ Error reading file ${filePath}:`, err.message);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('<h1>500 - Internal Server Error</h1>');
      return;
    }
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running at http://0.0.0.0:${PORT}`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Ready to accept requests!\n`);
});
