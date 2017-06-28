# jf-server-base [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[![npm install jf-server-base](https://nodei.co/npm/jf-server-base.png?compact=true)](https://npmjs.org/package/jf-server-base/)

A very simple wrapper for node webserver.

```js
// Receive log and save to disk.
const fs = require('fs');
require('jf-server-base').create(
    8888,
    (request, response, requestBody) => {
        fs.writeFileSync(
            `/tmp/request-${Date.now()}.log`, 
            JSON.stringify(requestBody)
        );
        response.writeHead(201);
        response.end();
    }
);
```

Callback will receive as third param the request body as object or string so you don't
need add listeners for retrieving body because `jfServerBase` exports other function, 
named `getBody`, for getting data of readable streams such as response and request 
parameters:

```js
const request  = require('http').request(
    {
        // Put request config here
    },
    response => require('jf-server-base').getBody(
        response,
        body => console.log(body)
    )
);
request.write(
    JSON.stringify(data)
);
request.end();
```
