import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  email: string;

  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  password: string;
}
