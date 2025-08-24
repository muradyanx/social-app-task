import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserDataDto } from '@common/dto/user-data.dto';
import { UserRepository } from '@/modules/users/repository/user.repository';
import { NotFoundError } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('Missing the value of JWT_SECRET');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findUserById(payload.id);

    if (!user) {
      throw new NotFoundError('User not found');
    }
    return new UserDataDto(payload);
  }
}