const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

morgan.token("body", (request, response) => {
  return JSON.stringify(request.body) || "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const information = `Phonebook has info for ${persons.length} people`;
  const timeNow = new Date().toString();

  response.send(`
    <p>${information}</p>
    <p>${timeNow}</p>
    `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body || {};

  const name = typeof body.name === "string" ? body.name.trim() : null;
  const number = typeof body.number === "string" ? body.number.trim() : null;

  if (!name || !number) {
    return response.status(400).json({
      error: "name or number is missing, invalid, or empty",
    });
  }

  const nameExists = persons.some(
    (person) => person.name.toLowerCase() === name.toLowerCase(),
  );

  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  let randomId;
  do {
    randomId = String(Math.floor(Math.random() * 1000000) + 1);
  } while (persons.some((person) => person.id === randomId));

  const newPerson = {
    id: randomId,
    name: name,
    number: number,
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
