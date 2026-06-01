const http = require('http');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hello World App</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          text-align: center;
          background: white;
          padding: 50px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        h1 {
          color: #333;
          margin: 0 0 10px 0;
        }
        .status {
          color: #667eea;
          font-size: 18px;
          margin-bottom: 20px;
        }
        .info {
          color: #666;
          font-size: 14px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1> Hello World!</h1>
        <p class="status">Jenkins CI/CD Pipeline - Deployed Successfully</p>
        <p class="info">
          <strong>Hostname:</strong> ${require('os').hostname()}<br>
          <strong>Time:</strong> ${new Date().toLocaleString()}<br>
          <strong>Node Version:</strong> ${process.version}
        </p>
      </div>
    </body>
    </html>
  `;
  
  res.end(html);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
