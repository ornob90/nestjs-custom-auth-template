import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserRegisterDto {
  readonly id: number;

  @IsNotEmpty({ message: 'Full Name is required' })
  @IsString({ message: 'Full Name needs to be string' })
  readonly fullName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: 'password is required' })
  @MinLength(6, { message: 'Password needs to be at least 6 characters long' })
  readonly password: string;
}
