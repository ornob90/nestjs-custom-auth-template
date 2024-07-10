import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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

@Injectable()
export class AuthService {
  constructor(
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

      const token = await this.jwtService.signAsync(payload);

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

  login(createUserLoginDto) {
    return [];
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

      const newUser = await this.userRepository.update(id, {
        currentStatus: 'activated',
      });

      return {
        newUser,
        decoded,
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to activate the user', {
        cause: new Error(),
        description: error.message,
      });
    }

    return [];
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
