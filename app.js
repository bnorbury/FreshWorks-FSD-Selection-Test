var http = require('http');

http.createServer((reg, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  
  
  res.end();
}).listen(8080);