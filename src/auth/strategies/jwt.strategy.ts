import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<any> {
    console.log('JWT Payload:', payload); // 토큰의 페이로드 확인

    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid JWT payload');
    }
    const user = {
      userId: payload.sub,
      email: payload.email,
    };

    if (!user.userId) {
      throw new UnauthorizedException('User ID is undefined');
    }

    return user;
  }
}
