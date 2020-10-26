import { BaseValidator } from "./index";

const PASSWORD_VALIDATION = "required|min:7";
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
    password: PASSWORD_VALIDATION,
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
    password: PASSWORD_VALIDATION,
  };
}

export class ForgotPasswordValidator extends BaseValidator {
  SCHEMA = {
    email: "email|required",
    redirectURL: "required|url",
  };
}

export class ChangeForgottenPasswordValidator extends BaseValidator {
  SCHEMA = {
    password: PASSWORD_VALIDATION,
    resetId: "required|min:30",
  };
}

const registerValidator = new RegisterValidator("body");
const loginValidator = new LoginValidator("body");
const forgotPasswordValidator = new ForgotPasswordValidator("body");
const changeForgottenPasswordValidator = new ChangeForgottenPasswordValidator(
  "body"
);

export {
  registerValidator,
  loginValidator,
  changeForgottenPasswordValidator,
  forgotPasswordValidator,
};
