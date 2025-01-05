import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";

import { ApiError } from "./errors/api-error";
import { userRouter } from "./routers/user.router";
import { read, write } from "./services/fs.service";

dotenv.config({ path: ".env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

app.get(
  "/users/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Params: ", req.params);
      console.log("Query: ", req.query);
      console.log("Body: ", req.body);
      const users = await read();
      const user = users.find((user) => user.id === +req.params.userId);
      if (!user) {
        throw new ApiError("User not found", 404);
      }
      res.json(user);
    } catch (e) {
      next(e);
    }
  },
);

app.put(
  "/users/:userId",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      if (!req.body.name || req.body.length < 3) {
        throw new ApiError(
          "Name is required and should be minimum 3 symbols",
          400,
        );
      }
      if (!req.body.email || !req.body.email.includes("@")) {
        throw new ApiError("Email is reqired.", 400);
      }
      if (!req.body.password || req.body.password.length < 8) {
        throw new ApiError(
          "Password is required and should be minimum 8 symbols",
          400,
        );
      }
      const users = await read();
      const index = users.findIndex(
        (user) => user.id === Number(req.params.userId),
      );

      if (index === -1) {
        throw new ApiError("User not found", 404);
      }

      const user = users[index];

      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      write(users);
      res.json(user);
    } catch (e) {
      next(e);
    }
  },
);

app.delete(
  "/users/:userId",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const users = await read();
      const index = users.findIndex(
        (user) => user.id === Number(req.params.userId),
      );

      if (index === -1) {
        throw new ApiError("User not found", 404);
      }

      users.splice(index, 1);
      write(users);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  },
);

app.use(
  "*",
  (error: ApiError, _req: Request, res: Response, _next: NextFunction) => {
    const status = error.status ?? 500;
    const message = error.message ?? "Something went wrong.";
    res.status(status).json({ status, message });
  },
);

process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception: ", error);
  process.exit(1);
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
