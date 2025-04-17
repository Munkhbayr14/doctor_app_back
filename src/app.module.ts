import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { PrismaModule } from './api/prisma/prisma.module';
import { BannerModule } from './api/banner/banner.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProfileModule } from './api/profile/profile.module';
import { MusicModule } from './api/music/music.module';
import { NotificationModule } from './api/notification/notification.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public', 'images'),
      serveRoot: '/images',
      serveStaticOptions: {
        index: false,
        redirect: false,
      },
    })
    , AuthModule, PrismaModule, BannerModule, ProfileModule, MusicModule, NotificationModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
