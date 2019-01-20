/*
*   Hello world primary API file
*/

// Dependencies
const http = require('http');
const url = require('url');
const config = require('./config');

const StringDecoder = require('string_decoder').StringDecoder;

// Instantiating the HTTP server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
    console.log(`The server is listening on port ${config.httpPort} in ${config.envName}`)
});

var unifiedServer = (req, res) => {
    let parsedURL = url.parse(req.url, true);
    let path = parsedURL.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');
    let queryStringObject = parsedURL.query;
    let method = req.method.toLowerCase();
    let headers = req.headers;
    let decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        let data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer,
        }

        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            payload = typeof(payload) === 'object' ? payload : {};

            payloadString = JSON.stringify(payload);

            res.setHeader('content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });

    });
};


let handlers = {};

handlers.ping = (data, callback) => {
    callback(200);
};
handlers.hello= (data, callback) => {
    callback(200, {'hello': 'Hi, thanks for checking out my homework assignment #1!'});
};
handlers.notFound = (data, callback) => {
    callback(404);
};


let router = {
    'ping' : handlers.ping,
    'hello' : handlers.hello,
};