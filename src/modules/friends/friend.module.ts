import { Module } from '@nestjs/common';
import { FriendController } from '@/modules/friends/friend.controller';
import { FriendService } from '@/modules/friends/friend.service';
import { FriendRepository } from '@/modules/friends/friend.repository';
import { UserRepository } from '@/modules/users/repository/user.repository';

@Module({
  imports: [],
  controllers: [FriendController],
  providers: [FriendService, FriendRepository, UserRepository],
})
export class FriendModule {}