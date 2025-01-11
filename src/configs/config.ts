import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const config = {
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URI,
  frontUrl: process.env.FRONT_URL || "http://localhost:3000",

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,

  smtpEmail: process.env.SMTP_EMAIL,
  smtpPassword: process.env.SMTP_PASSWORD,
};
