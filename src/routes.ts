import { Application } from 'express';
import { AuthController } from './controllers/auth';

export class Routes {
    public static authController: AuthController = new AuthController();

    public static addRoutesToApp(app: Application): void {
      app.route('/auth/register')
        .post(this.authController.register);
    }
}
