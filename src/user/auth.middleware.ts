import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  private readonly jwtSecret = ';p jimtrq qetvrdvjdsv0w43094t34 u-[u9 55 9'; // Use uma chave JWT segura

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }
    console.log('rlfirufhfihu');
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      req.user = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
