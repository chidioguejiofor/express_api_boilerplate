import jwt from "jsonwebtoken";

export class TokenValidator {
  static TOKEN_SCRET = process.env.JWT_SECRET;

  static createToken(data: Record<string, string>, expiresIn: string) {
    return jwt.sign(data, this.TOKEN_SCRET, { expiresIn });
  }

  static decodeToken(token) {
    try {
      const decoded = jwt.verify(token, this.TOKEN_SCRET);
      return [true, decoded];
    } catch (err) {
      return [
        false,
        {
          message: "Session invalid, please login again",
        },
      ];
    }
  }
}
