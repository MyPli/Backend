import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LikeModule } from './like/like.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PlaylistModule } from './playlist/playlist.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [LikeModule, PlaylistModule, PrismaModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
