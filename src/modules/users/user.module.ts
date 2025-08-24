import { Module } from '@nestjs/common';
import { UserRepository } from '@/modules/users/repository/user.repository';
import { UserService } from '@/modules/users/user.service';
import { UserController } from '@/modules/users/user.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository, UserService],
})
export class UserModule {}
