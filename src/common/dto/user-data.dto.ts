import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { UserData } from '@common/interface/user-data.interface';

export class UserDataDto {
  constructor(user: UserData) {
    this.id = user.id;
    this.email = user.email;
    this.roleId = user.roleId;
  }
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  roleId: number;
}