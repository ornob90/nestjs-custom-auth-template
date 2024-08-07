import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Put,
  Req,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserRegisterDto } from './dto/create-user-register.dto';
import { User } from 'src/user/user.entity';
import { CreateUserVerifyDto } from './dto/create-user-verify.dto';
import { CreateUserLoginDto } from './dto/create-user-logn.dto';
import { VerifyRequest } from 'src/middlewares/verfiy.middleware';
import { Session } from 'src/types/auth.types';
import { CreateUserRefreshDto } from './dto/create-user-refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('session')
  @UsePipes(new ValidationPipe())
  session(@Req() req: VerifyRequest) {
    const session = req.user;
    return this.authService.session(session);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(
    @Body() createUserRegisterDto: CreateUserRegisterDto,
  ): Promise<User> {
    return this.authService.register(createUserRegisterDto);
  }

  @Post('login')
  login(@Body() createUserLoginDto: CreateUserLoginDto) {
    return this.authService.login(createUserLoginDto);
  }

  @Post('logout')
  logout(@Req() req: VerifyRequest) {
    return this.authService.logout(req);
  }

  @Post('forgot-password')
  forgotPassword() {
    return this.forgotPassword();
  }

  @Post('refresh')
  @UsePipes(new ValidationPipe())
  refresh(@Body() createUserRefreshDto: CreateUserRefreshDto) {
    return this.authService.refresh(createUserRefreshDto);
  }

  @Put('activate-account')
  activateAccount(@Body() createUserVerifyDto: CreateUserVerifyDto) {
    return this.authService.activateAccount(createUserVerifyDto);
  }
}
