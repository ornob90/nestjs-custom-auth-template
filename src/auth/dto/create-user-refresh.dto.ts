import { IsNotEmpty } from 'class-validator';

export class CreateUserRefreshDto {
  @IsNotEmpty()
  readonly refreshToken: string;
}
