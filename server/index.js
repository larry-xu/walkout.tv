var http = require('http');
var https = require('https');

function requestListener(req, res) {
  console.log('received path:', req.url);

  try {
    var url = req.url.substr(1);

    function proxyHandler(proxyRes) {
      proxyRes.headers['access-control-allow-origin'] = '*';
      res.writeHead(proxyRes.statusCode, proxyRes.headers)
      proxyRes.pipe(res);
      console.log('successfully proxied url:', url);
    }
    var proxyReq = https.request(url, proxyHandler);
    proxyReq.end();
  } catch (error) {
    res.writeHead(500);
    res.end();
    console.error('failed to proxy with error:', error);
  }
}

var server = http.createServer(requestListener);
server.listen(3000);
