var express = require('express');
var path = require('path');
var enforce = require('express-sslify');
var serveStatic = require('serve-static');

const app = express();

app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.use(serveStatic(__dirname + "/dist"));
var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+ port);