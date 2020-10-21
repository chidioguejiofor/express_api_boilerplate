import { BaseValidator } from "./index";

export class AuthValidator extends BaseValidator {
  SCHEMA = {
    email: "email|required",
    firstName: "required|max:50|min:1",
    lastName: "required|max:50|min:1",
  };
}

const registerValidator = new AuthValidator("body");

export { registerValidator };
