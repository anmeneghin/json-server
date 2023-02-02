const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('server/db.json');
const middlewares = jsonServer.defaults();
const db = require('./db.json');
const fs = require('fs');

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use(jsonServer.rewriter({
  "/itens/_search?nome=:searchstring": "/itens/?nome_like=:searchstring"
}))
