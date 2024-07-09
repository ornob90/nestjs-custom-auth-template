import { IsNotEmpty } from 'class-validator';

export class CreateUserVerifyDto {
  @IsNotEmpty()
  readonly token: string;
}
