import { IsArray, IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { GetUserInterface } from '@common/interface/get-users.interface';

export class GetUsersResponseDto {
  constructor(user: GetUserInterface) {
    this.firstName = user.first_name;
    this.lastName = user.last_name;
    this.age = user.age;
    this.email = user.email;
    this.roleId = user.role_id;
  }

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

export class GetUsersResponseDtoArray {
  constructor(users: GetUserInterface[]) {
    this.users = users.map((user) => new GetUsersResponseDto(user));
  }
  @IsNotEmpty()
  @IsArray()
  users: GetUsersResponseDto[];
}