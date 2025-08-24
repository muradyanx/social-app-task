import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { GetProfileInterface } from '@common/interface/get-profile.interface';

export class GetProfileDto {
  constructor(user: GetProfileInterface) {
    this.id = user.id;
    this.firstName = user.first_name;
    this.lastName = user.last_name;
    this.age = user.age;
    this.email = user.email;
    this.roleId = user.role_id;
  }

  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsInt()
  age: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsInt()
  roleId: number;
}