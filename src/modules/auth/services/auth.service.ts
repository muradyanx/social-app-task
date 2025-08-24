import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import {
  hashPasswordUtil,
  comparePassword,
} from '@common/utils/hash-password.util';
import { RolesEnum } from '@/common/enum/roles.enum';
import { RoleRepository } from '@/modules/auth/repositories/role.repository';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { JwtTokenService } from '@/modules/auth/services/jwt-token.service';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@/modules/users/repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly jwtTokenService: JwtTokenService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    userData: RegisterDto,
    securityStamp: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { password, email } = userData;
    const user = await this.userRepository.findUserByEmail(email);
    if (user) {
      throw new BadRequestException('Email already in use');
    }
    const role = await this.roleRepository.findRoleByName(RolesEnum.USER);
    const passwordHash = await hashPasswordUtil(password);
    const refreshTokenExp = this.configService.get<string>('REFRESH_TOKEN_EXP');
   await this.userRepository.createUser(
      userData,
      passwordHash,
      role.id,
      securityStamp,
    );
    const newUser = await this.userRepository.findUserByEmail(email);
    const jwtPayload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role_id,
      securityStamp: securityStamp,
    };
    const accessToken = this.jwtTokenService.generateToken(jwtPayload);
    const refreshToken = this.jwtTokenService.generateToken({
      ...jwtPayload,
      refreshTokenExp,
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async login(userData: LoginDto, securityStamp: string): Promise<{ accessToken: string; refreshToken: string }> {
    const { password, email } = userData;
    const user = await this.userRepository.findUserByEmail(email);
    const refreshTokenExp = this.configService.get<string>('REFRESH_TOKEN_EXP');
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const jwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role_id,
      securityStamp: securityStamp,
    };
    const accessToken = this.jwtTokenService.generateToken(jwtPayload);
    const refreshToken = this.jwtTokenService.generateToken({
      ...jwtPayload,
      refreshTokenExp,
    });
    return { accessToken, refreshToken };
  }
}
