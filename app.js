const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [
  {
    id: 1,
    name: "Oleksandr",
    email: "super.oleksandr@email.com",
    password: "password",
  },
  {
    id: 2,
    name: "Oleksandr",
    email: "super.oleksandr@email.com",
    password: "password",
  },
  {
    id: 3,
    name: "Oleksandr",
    email: "super.oleksandr@email.com",
    password: "password",
  },
  {
    id: 4,
    name: "Oleksandr",
    email: "super.oleksandr@email.com",
    password: "password",
  },
  {
    id: 5,
    name: "Oleksandr",
    email: "super.oleksandr@email.com",
    password: "password",
  },
  {
    id: 6,
    name: "Oleksandr",
    email: "super.oleksandr@email.com",
    password: "password",
  },
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
  const user = {
    id: users.length,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  users.push(user);
  res.status(201).json(user);
});

app.get("/users/:userId", (req, res) => {
  console.log("Params: ", req.params);
  console.log("Query: ", req.query);
  console.log("Body: ", req.body);
  const user = users.find((user) => user.id === +req.params.userId);
  res.json(user);
});

app.delete("/users/:userId", (req, res) => {
  users = users.filter((user) => user.id != Number(req.params.userId));
  res.json({ message: "User was deleted" });
});

// create-user -> users (POST)
// get-list-users -> users (GET)
// get-user-by-id -> users/:id (GET)
// update-user -> users/:id (PATCH)
// delete-user -> users/:id (DELETE)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
