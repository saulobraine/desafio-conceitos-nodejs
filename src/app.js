const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

// MIDDLEWARE

const checkID = (request, response, next) => {
  const { id } = request.params;

  const indexRepository = repositories.findIndex(repository => repository.id === id);

  if (indexRepository < 0) {
    return response.status(400).send({ error: "Projeto não encontrado" });
  }

  request.indexRepository = indexRepository;

  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;

  repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.send(repository);
});

app.put("/repositories/:id", checkID, (request, response) => {
  const { title, url, techs } = request.body;
  const indexRepository = request.indexRepository;

  repository = {
    ...repository,
    title,
    url,
    techs
  };

  repositories[indexRepository] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", checkID, (request, response) => {
  const indexRepository = request.indexRepository;

  repositories.splice(indexRepository, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkID, (request, response) => {

  const indexRepository = request.indexRepository;
  const { user_id } = request.body;

  const repository = repositories[indexRepository];

  const like = {
    id: uuid(),
    repository_id: repository.id,
    date: `${Date.now()}`,
    user_id
  }

  likes.push(like);

  const newLikes = ++repository.likes;

  const updatedRepository = repositories[indexRepository] = {
    ...repository,
    likes: newLikes
  }

  return response.json(updatedRepository);

});

app.get('/repositories/:id/like/details', checkID, (request, response) => {
  const { id } = request.params;

  const filteredDetailLikes = likes.filter(like => like.repository_id === id); 

  return response.json(filteredDetailLikes);
});

module.exports = app;
