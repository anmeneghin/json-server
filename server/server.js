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
  let ordem = '';


  // ORDENAÇÃO
  const sort_by = (field, reverse, primer) => {
    const key = primer ?
      function (x) {
        return primer(x[field]);
      } :
      function (x) {
        return x[field];
      };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    };
  };

  if (req.query._order === 'desc') {
    ordem = true;
  } else {
    ordem = false;
  }

  db.itens.sort(sort_by(req.query._sort, ordem));

  // FILTRO
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

  // LIMITE POR PAGINA
  const offset = req.query._limit * (req.query._page - 1);
  const arraySlice = ret.slice(offset, req.query._page * req.query._limit);

  console.log(req.query);

  res.jsonp(arraySlice)
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