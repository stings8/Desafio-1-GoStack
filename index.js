const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let count = 0;

server.use((req, res, next) => {
  count ++;
  console.log(`Método: ${req.method}; URL: ${req.url}; Count Requests: ${count}`);

  next();
});

function checkProjectForIdExists(req, res, next){
  const { id } = req.params;

  if(!projects.find( getId => getId.id == id)){
    return res.status(400).json({ error: 'Project not found'});
  }
  return next();
}

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({id, title, tasks: []});
  return res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectForIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find( getId => getId.id == id)

  project.tasks.push(title);
  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectForIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find( getId => getId.id == id );
  project.title = title;

  return res.json(project);

});

server.delete('/projects/:id', checkProjectForIdExists, (req, res) => {
  const { id } = req.params;

  projects.splice(id, 1);
  return res.json({ message: "project deleted"});

});



server.listen(3000);