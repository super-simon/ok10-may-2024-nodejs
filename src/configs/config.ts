import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const config = {
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URI,
};
