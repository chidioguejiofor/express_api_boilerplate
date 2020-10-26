import { BaseValidator } from "./index";

export class RegisterValidator extends BaseValidator {
  SCHEMA = {
    email: "email|required",
    firstName: "required|max:50|min:1",
    lastName: "required|max:50|min:1",
    dob: "required|date",
    location: "required",
    callCode: "required|max:5|min:2",
    gender: "required|in:male,female",
    bvn: "",
    password: "required|min:7",
    redirectURL: "required|url",
  };

  protected transformInputData(
    key: string,
    value: string,
    data: Record<string, unknown>
  ) {
    if (key === "gender") return value.toLowerCase();
    return value;
  }
}

export class LoginValidator extends BaseValidator {
  SCHEMA = {
    email: "email|required",
    password: "required|min:7",
  };
}

const registerValidator = new RegisterValidator("body");
const loginValidator = new LoginValidator("body");

export { registerValidator, loginValidator };
