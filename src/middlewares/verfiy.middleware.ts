import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface VerifyResponse extends Response {
  user: string;
}

@Injectable()
export class VerifyMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  async use(req: Request, res: VerifyResponse, next: NextFunction) {
    try {
      const { authorization } = req.headers;

      const token = authorization && authorization?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Unauthorize Access1');
      }

      const decoded = await this.decodeToken(token);

      if (!decoded) {
        throw new UnauthorizedException('Unauthorize Access2');
      }

      //   console.log({ decoded });

      const tokenFromMemory = await this.cacheManager.get(`${decoded.id}`);

      if (!tokenFromMemory) {
        throw new UnauthorizedException('Unauthorize Access6');
      }

      const decodedFromMemory = await this.decodeToken(tokenFromMemory);

      if (!decodedFromMemory) {
        throw new UnauthorizedException('Unauthorize Access3');
      }

      if (decoded?.id !== decodedFromMemory?.id) {
        throw new UnauthorizedException('Unauthorize Access4');
      }

      res.user = decoded;

      next();
    } catch (error) {
      throw new InternalServerErrorException('Unauthorize Access5', {
        cause: new Error(),
        description: error.message,
      });
    }
  }

  private async decodeToken(token: string) {
    const decoded = await this.jwtService.verify(token, {
      secret: jwtConfig.secret,
    });

    return decoded;
  }
}
