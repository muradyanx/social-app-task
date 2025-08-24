import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '@common/interface/request-with-user.interface';
import { UserService } from '@/modules/users/user.service';
import { SearchUsersDto } from '@/modules/users/dto/search-users.dto';
import { GetUsersResponseDtoArray } from '@/modules/users/dto/get-users-response.dto';
import { GetProfileDto } from '@/modules/users/dto/get-profile.dto';
import { GetProfileResponseInterface } from '@common/interface/get-profile.interface';
import { GetUsersResponseInterface } from '@common/interface/get-users.interface';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(
    @Req() req: RequestWithUser,
  ): Promise<GetProfileResponseInterface>
  {
    const userData = await this.userService.getUserData(req.user.email);
    return {
      status: HttpStatus.OK,
      user: new GetProfileDto(userData),
    };
  }

  @Get('search-users')
  async searchUsers(
    @Query() query: SearchUsersDto,
  ): Promise<GetUsersResponseInterface> {
    const usersData = await this.userService.searchUsers(
      query.limit,
      query.page,
      query.firstName,
      query.lastName,
      query.age,
    );
    return {
      status: HttpStatus.OK,
      data: new GetUsersResponseDtoArray(usersData.users),
      page: usersData.page,
      limit: usersData.limit,
      total: usersData.total,
    };
  }
}
