const express = require("express");
const dotenv = require("dotenv");
const { read, write } = require("./fs.service");

dotenv.config({ path: ".env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/users", async (_req, res) => {
  try {
    const users = await read();
    res.json(users);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

app.post("/users", async (req, res) => {
  try {
    const users = await read();
    const user = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    users.push(user);
    await write(users);
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

app.get("/users/:userId", async (req, res) => {
  console.log("Params: ", req.params);
  console.log("Query: ", req.query);
  console.log("Body: ", req.body);
  const users = await read();
  const user = users.find((user) => user.id === +req.params.userId);
  res.json(user);
});

app.put("/users/:userId", async (req, res) => {
  try {
    const users = await read();
    const index = users.findIndex(
      (user) => user.id === Number(req.params.userId),
    );
    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[index];

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    write(users);
    res.json(user);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

app.delete("/users/:userId", async (req, res) => {
  try {
    const users = await read();
    const index = users.findIndex(
      (user) => user.id === Number(req.params.userId),
    );
    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }
    users.splice(index, 1);
    write(users);
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

// create-user -> users (POST)
// get-list-users -> users (GET)
// get-user-by-id -> users/:id (GET)
// update-user -> users/:id (PATCH)
// delete-user -> users/:id (DELETE)

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
