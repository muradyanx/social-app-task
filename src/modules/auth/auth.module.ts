import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RoleRepository } from '@/modules/auth/repositories/role.repository';
import { JwtTokenService } from '@/modules/auth/services/jwt-token.service';
import { AuthService } from '@/modules/auth/services/auth.service';
import { AuthController } from '@/modules/auth/auth.controller';
import { UserRepository } from '@/modules/users/repository/user.repository';
import { JwtStrategy } from '@common/strategy/jwt-strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@/modules/users/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '3600s',
        },
      }),
    }),
    PassportModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtTokenService,
    UserRepository,
    RoleRepository,
    JwtStrategy,
  ],
  exports: [
    AuthService,
    JwtTokenService,
    UserRepository,
    PassportModule,
  ],
})
export class AuthModule {}
