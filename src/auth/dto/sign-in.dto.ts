import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  email!: string;

  @IsString()
  password!: string;
}

export class LoginResult {
  @IsString()
  email?: string;

  @IsString()
  name?: string;

  @IsString()
  firstLastName?: string;

  @IsString()
  secondLastName?: string;
}
