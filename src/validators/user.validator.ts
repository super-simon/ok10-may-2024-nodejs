import joi from "joi";
import { regexConstant } from "../constants/regex.constant";

export class UserValidator {
  private static name = joi.string().min(3).max(50).trim();
  private static age = joi.number().min(18).max(200);
  private static email = joi.string().email().trim();
  private static password = joi.string().regex(regexConstant.PASSWORD);
  private static phone = joi.string().regex(regexConstant.PHONE);

  public static create = joi.object({
    name: this.name.required(),
    age: this.age.required(),
    email: this.email.required(),
    password: this.password.required(),
    phone: this.phone.trim().optional(),
  });

  public static update = joi.object({
    name: this.name,
    age: this.age,
    phone: this.phone,
  });

  public static login = joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });
}
