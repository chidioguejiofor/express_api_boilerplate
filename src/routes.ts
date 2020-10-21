import { Application, Router } from "express";
import { registerValidator } from "./validation/auth";
import { AuthController } from "./controllers/auth";

export class Routes {
  public static authController: AuthController = new AuthController();

  public static addRoutesToApp(app: Application): void {
    const router = Router();
    router
      .route("/auth/register")
      .post(registerValidator.middleware, this.authController.register);

    app.use("/api", router);
  }
}
