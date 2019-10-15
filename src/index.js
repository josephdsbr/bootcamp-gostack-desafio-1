const express = require('express');

const server = express();
server.use(express.json());

/* Variáveis 
que serão utilizadas durante o processo.
A `number` teve que ser let porque vai sofrer alteração.
Inicializei projetos como um Array vazio.
*/

let number = 0;
const projetos = [];

/* Middleware */

/* Verificando se o projeto existe */

function verifyIfProjectExists(req, res, next) {

  const { id } = req.params;

  if(!projetos.find(projeto => projeto.id == id)){
    return res.status(400).send({error: "Project does not exist"});
  }

  return next();
}

/* Global para registrar a quantidade de requisições */

server.use((req, res, next) => {
  number++;
  console.log(`Requisições: ${number}`);
  return next();
});


/* Desenvolvendo as rotas para CRUD */

/* Rota para adicionar projetos ao Array */

server.post('/projects', (req, res) => {
  const {id, title } = req.body;
  projetos.push({id:id, title:title});
  return res.json(projetos);
})

/* Rota para capturar todos os projetos registrados */

server.get('/projects', (req, res) => {
  return res.json(projetos);
})

/* Rota para alterar o title de um dos projetos */

server.put('/projects/:id', verifyIfProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  const projeto = projetos.find(projeto => projeto.id == id);
  projeto.title = title;
  return res.json(projeto);
})

/* Rota para remover um projeto */

server.delete('/projects/:id', verifyIfProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projetos.findIndex(x => x.id == id);
  projetos.splice(index, 1);
  return res.send()
})

/* Rota para adicionar Task em um projeto específico */

server.post("/projects/:id/tasks", verifyIfProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const projeto = projetos.find(projeto => projeto.id == id);
  projeto.tasks = [];
  projeto.tasks.push(title);

  return res.json(projeto);
})

/* Configurações do Servidor */

server.listen(3333);