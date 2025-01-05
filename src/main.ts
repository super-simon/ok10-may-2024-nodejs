import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";

import { ApiError } from "./errors/api-error";
import { userRouter } from "./routers/user.router";

dotenv.config({ path: ".env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

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
