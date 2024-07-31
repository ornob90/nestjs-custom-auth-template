import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserRegisterDto } from './dto/create-user-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { nodemailerConfig } from 'src/config/nodemailer.config';
import { CreateUserVerifyDto } from './dto/create-user-verify.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateUserLoginDto } from './dto/create-user-logn.dto';

@Injectable()
export class AuthService {
  private readonly sevenDaysExpire = 7 * 24 * 60 * 60;
  private readonly hourExpire = 60 * 60;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly messageService: MailerService,
  ) {}

  async register(createUserRegisterDto: CreateUserRegisterDto) {
    try {
      const { email, password, ...restUser } = createUserRegisterDto;

      const isExist = await this.userRepository.findOneBy({
        email: email,
      });

      if (isExist) {
        throw new BadRequestException('User already registered', {
          cause: new Error(),
          description: 'User already registered with this email',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        ...restUser,
      });

      const saveResponse = await this.userRepository.save(user);

      const payload = {
        email,
        id: saveResponse?.id,
        fullName: saveResponse?.fullName,
      };

      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      });

      await this.cacheManager.set(
        `${saveResponse.id}_email_token`,
        token,
        this.hourExpire,
      );

      await this.sendMail(
        `Please click on this link to confirm ${process.env.ORIGIN_URL + `?token=${token}`}`,
        email,
      );

      return saveResponse;
    } catch (error) {
      throw new InternalServerErrorException('Unable to register the user', {
        cause: new Error(),
        description: error.message,
      });
    }
  }

  async login(createUserLoginDto: CreateUserLoginDto) {
    try {
      const { email, password } = createUserLoginDto;

      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new NotFoundException('User not registered');
      }

      if (user.currentStatus !== 'activated') {
        throw new UnauthorizedException('User not activated!');
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid password', {
          cause: new Error(),
          description: 'Unable to login',
        });
      }

      const payload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      };

      const token = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      await this.cacheManager.set(`${user.id}`, token, this.sevenDaysExpire);

      // const savedToken = await this.cacheManager.get(`${user.id}`);

      return {
        success: true,
        token,
      };
    } catch (error) {
      throw new InternalServerErrorException('Login Failed', {
        cause: new Error(),
        description: error.message,
      });
    }
  }

  async activateAccount(createUserVerifyDto: CreateUserVerifyDto) {
    try {
      const { token } = createUserVerifyDto || {};

      const decoded = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      if (!decoded) {
        throw new UnauthorizedException('Unauthorize access');
      }

      const { id } = decoded;

      const curDate = Math.floor(Date.now() / 1000);

      const isExpired = decoded.exp < curDate;

      if (isExpired) {
        throw new BadRequestException('Token Expired!');
      }

      const tokenFromRedis = await this.cacheManager.get(`${id}_email_token`);

      if (!tokenFromRedis || token !== tokenFromRedis) {
        throw new BadRequestException('Invalid Token');
      }

      const user = await this.userRepository.findOneBy(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user?.currentStatus && user?.currentStatus === 'activated') {
        throw new BadRequestException('User already activated');
      }

      await this.userRepository.update(id, {
        currentStatus: 'activated',
      });

      const payload = {
        email: decoded.email,
        id: decoded?.id,
        fullName: decoded?.fullName,
      };

      const newToken = await this.jwtService.signAsync(payload);

      await this.cacheManager.set(decoded.id, newToken, this.sevenDaysExpire);
      await this.cacheManager.del(`${id}_email_token`);

      return {
        token: newToken,
        user: payload,
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to activate the user', {
        cause: new Error(),
        description: error.message,
      });
    }
  }

  forgotPassword() {
    return [];
  }

  private async sendMail(message: string, to: string, subject?: string) {
    this.messageService.sendMail({
      from: 'Kazi Towfiq <ornonornob@gmail.com>',
      to,
      subject: subject || 'Email Confirmation!',
      text: message,
    });
  }
}
