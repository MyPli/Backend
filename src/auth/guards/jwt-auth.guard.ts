import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('인증 토큰을 포함해주세요');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('JWT token이 없습니다');
    }

    try {
      const payload = this.jwtService.verify(token);

      // 사용자 정보를 요청 객체에 설정
      request.user = { userId: payload.sub, email: payload.email };
      return true;
    } catch (error) {
      throw new UnauthorizedException('유효하지 않거나 만료된 토큰입니다');
    }
  }
}
