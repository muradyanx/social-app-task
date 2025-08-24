import { BadRequestException, Injectable } from '@nestjs/common';
import { FriendRepository } from '@/modules/friends/friend.repository';
import { UserRepository } from '@/modules/users/repository/user.repository';
import { RequestStatus } from '@common/enum/request-status.enum';

@Injectable()
export class FriendService {
  constructor(
    private readonly friendRepository: FriendRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async sendFriendRequest(senderId: number, receiverId: number) {
    if (!senderId || !receiverId) {
      throw new BadRequestException('Missing sender or receiver value');
    }
    if (senderId === receiverId) {
      throw new BadRequestException('You cannot send a request to yourself');
    }
    const receiver = await this.userRepository.findUserById(receiverId);
    if (receiver === undefined) {
      throw new BadRequestException('Receiver not found');
    }
    const request =
      await this.friendRepository.getRequestByReceiverId(receiverId);
    if (request) {
      throw new BadRequestException('Request already sent to this user');
    }
    await this.friendRepository.saveRequest(senderId, receiverId);
  }

  async getFriendRequests(receiverId: number) {
    const receiver = await this.userRepository.findUserById(receiverId);
    if (receiver === undefined) {
      throw new BadRequestException('Receiver not found');
    }
    const requesList = await this.friendRepository.getRequestsList(receiverId);
    if (!requesList.length) {
      throw new BadRequestException('No requests found');
    }
    return requesList;
  }

  async updateRequestStatus(
    requestId: number,
    receiverId: number,
    status: string,
  ) {
    const request = await this.friendRepository.getRequestByIdAndReceriver(
      requestId,
      receiverId,
    );
    if (!request) {
      throw new BadRequestException('Request not found');
    }
    if (status === RequestStatus.ACCEPTED) {
      await this.friendRepository.updateFriends(receiverId, request.sender_id);
    }
    await this.friendRepository.updateRequestStatus(requestId, status);
  }
}
