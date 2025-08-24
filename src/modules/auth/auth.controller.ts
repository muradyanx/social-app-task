import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AuthService } from '@/modules/auth/services/auth.service';
import { JwtTokenService } from '@/modules/auth/services/jwt-token.service';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { AuthInterface } from '@common/interface/register-response.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  @Post('register')
  async register(@Body() userDto: RegisterDto): Promise<AuthInterface> {
    const securityStamp = uuid();
    const { accessToken, refreshToken } = await this.authService.register(
      userDto,
      securityStamp,
    );

    return {
      status: HttpStatus.CREATED,
      message: 'User registered',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  @Post('login')
  async login(@Body() userDto: LoginDto): Promise<AuthInterface> {
    const securityStamp = uuid();
    const { accessToken, refreshToken } = await this.authService.login(
      userDto,
      securityStamp,
    );
    return {
      status: HttpStatus.OK,
      message: 'User logged in',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
