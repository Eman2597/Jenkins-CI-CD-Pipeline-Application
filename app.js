const http = require('http');
const os = require('os');

const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  const hostname = os.hostname();
  const nodeVersion = process.version;
  const currentTime = new Promise((resolve) => {
    resolve(new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));
  });

  currentTime.then((timeString) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CI-CD Pipeline Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-900 text-slate-100 font-sans min-h-screen flex items-center justify-center p-6">
        <div class="max-w-xl w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transform transition-all hover:scale-[1.01]">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-center relative">
                <div class="absolute top-4 right-4 flex items-center space-x-2">
                    <span class="relative flex h-3 w-3">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    <span class="text-xs font-semibold text-emerald-100 bg-emerald-700/30 px-2 py-0.5 rounded-full">Live</span>
                </div>
                <h1 class="text-2xl font-bold text-white tracking-wide">CI-CD-Pipeline-Application</h1>
                <p class="text-emerald-100 text-sm mt-1 font-medium tracking-wider">Jenkins CI/CD Pipeline Deployed Successfully</p>
            </div>

            <div class="p-8 space-y-6">
                <div class="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/60 rounded-xl">
                    <div class="flex items-center space-x-3">
                        <div class="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Docker Container ID (Hostname)</p>
                            <p class="text-base font-mono font-bold text-slate-200 mt-0.5">${hostname}</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="p-4 bg-slate-800/50 border border-slate-700/60 rounded-xl">
                        <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Node.js Version</p>
                        <p class="text-lg font-semibold text-amber-400 mt-1">${nodeVersion}</p>
                    </div>
                    <div class="p-4 bg-slate-800/50 border border-slate-700/60 rounded-xl">
                        <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Exposed Port</p>
                        <p class="text-lg font-semibold text-sky-400 mt-1">8084</p>
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Deployment Timestamp
                    </span>
                    <span class="font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-700/30 text-slate-300">${timeString}</span>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    res.end(html);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});