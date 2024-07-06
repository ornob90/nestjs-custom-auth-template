import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserRegisterDto } from './dto/create-user-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    jwtService: JwtService,
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

  verify() {
    return [];
  }

  forgotPassword() {
    return [];
  }
}
