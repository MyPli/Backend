import { Body, Controller, Get, UseGuards, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('인증') // Swagger 문서에서 '인증'이라는 섹션에 표시.
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입', description: '이메일과 비밀번호로 새로운 계정을 생성합니다.' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    schema: {
      example: {
        message: '회원가입이 완료되었습니다.',
        userId: 1,
      },
    },
  })
  @ApiResponse({ status: 400, description: '입력값이 잘못되었습니다.' })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '이메일과 비밀번호로 로그인하여 JWT를 반환합니다.' })
  @ApiResponse({
    status: 200,
    description: '로그인에 성공했습니다. 액세스 토큰이 반환됩니다.',
    schema: {
      example: {
        accessToken: 'jwt-token',
        refreshToken: 'refresh-token',
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증에 실패했습니다.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @ApiOperation({
    summary: 'Google 로그인 페이지로 리다이렉트',
    description: 'Google 로그인 페이지로 리다이렉트합니다.',
  })
  @ApiResponse({ status: 302, description: 'Google 로그인 페이지로 리다이렉트합니다.' })
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport가 자동으로 리다이렉션 처리
  }

  @Get('google/callback')
  @ApiOperation({
    summary: 'Google 로그인 콜백 처리',
    description: 'Google 로그인 이후의 콜백을 처리하고 사용자 정보를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'Google 소셜로그인에 성공했습니다.',
    schema: {
      example: {
        message: 'Google 소셜로그인에 성공했습니다',
        user: {
          id: '12345',
          email: 'example@gmail.com',
          name: '사용자 이름',
        },
      },
    },
  })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return {
      message: 'Google 소셜로그인에 성공했습니다',
      user: req.user,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃', description: '로그아웃을 수행하고 세션을 무효화합니다.' })
  @ApiBearerAuth() // JWT 인증을 명시
  @ApiResponse({ status: 200, description: '로그아웃에 성공했습니다.' })
  @ApiResponse({ status: 401, description: '인증이 필요합니다.' })
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    const userId = req.user.userId;
    await this.authService.logout(userId);
    return { message: '로그아웃에 성공했습니다' };
  }
}
