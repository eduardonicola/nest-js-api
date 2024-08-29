import { User } from './user/entities/user.entity'; // Importe sua entidade User

declare module 'express-serve-static-core' {
  interface Request {
    user?: User; // Aqui você pode definir o tipo de 'user' como sua entidade de User
  }
}
