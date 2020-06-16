var http = require('http');
var https = require('https');

var re = /\/transcode\/([^\/]+)\//;

function requestListener(req, res) {
  console.log('received path:', req.url);

  try {
    var url = req.url.substr(1);
    if (url.substr(0, 4) !== 'http') {
      var result = re.exec(url);
      if (result === null) {
        throw new Error('could not determine host to proxy to');
      }
      url = 'https://prod-fastly-' + result[1] + '.video.periscope.tv/' + url;
    }

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

var args = process.argv.slice(2);
if (args.length === 0) {
  console.error('must specify a port argument');
  process.exit(1);
}

var port = args[0];
var server = http.createServer(requestListener);
server.listen(port);
