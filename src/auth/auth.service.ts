import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  // 회원가입
  async signup(signupDto: SignupDto) {
    const { email, password, nickname } = signupDto;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword, nickname },
      });

      return { message: '회원가입이 완료되었습니다.', userId: user.id };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('이미 사용 중인 이메일 또는 닉네임입니다.');
      }
      throw error;
    }
  }

  // 로그인
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  // Google 소셜 로그인
  // auth.service.ts
  async googleLogin(payload: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    sub: string;
  }) {
    const { email, firstName, lastName, picture, sub } = payload;

    // DB에 사용자 정보 저장 또는 업데이트
    const user = await this.prisma.user.upsert({
      where: { email },
      create: {
        email,
        authProvider: 'google',
        authProviderId: sub,
        nickname: `${firstName} ${lastName}`,
        profileImage: picture,
      },
      update: {
        authProviderId: sub,
        nickname: `${firstName} ${lastName}`,
        profileImage: picture,
      },
    });

    // JWT 토큰 발급
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  async logout(userId: number) {
    // Refresh Token을 삭제하거나 무효화
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }
}
