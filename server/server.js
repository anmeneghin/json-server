const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('server/db.json');
const middlewares = jsonServer.defaults();
const db = require('./db.json');
const fs = require('fs');


// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/itens', (req, res) => {
  let ret = [];

  // res.jsonp(req.query)
  // res.jsonp(db.itens)
  // console.log(req.query)

  db.itens.map(
    (item) => {
      console.log(item)

      if (item.nome == req.query.nome_like) {
        ret.push(item)
      } else if (item.nome !== req.query.nome_like) {
        delete req.query.nome_like
        Object.assign(req.query, { descricao_like: item.descricao });
        ret.push(item)
      } else if (item.descricao !== req.query.descricao_like) {
        delete req.query.descricao_like
        Object.assign(req.query, { status_like: item.status });
        ret.push(item)
      } else if (item.status !== req.query.status_like) {
        delete req.query.status_like
        Object.assign(req.query, { responsavel_like: item.responsavel });
        ret.push(item)
      } else if (item.responsavel !== req.query.responsavel_like) {
        delete req.query.responsavel_like
        Object.assign(req.query, { data_like: item.data });
        ret.push(item)
      }


    }
  )

  console.log(req.query);
  res.jsonp(ret)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
// server.use(jsonServer.bodyParser)

// server.use((req, res, next) => {
//   if (req.method === 'POST') {
//     req.body.createdAt = Date.now()
//   }
//   // Continue to JSON Server router
//   next()
// })

// Use default router
// server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})