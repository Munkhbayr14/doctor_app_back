import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { PrismaModule } from './api/prisma/prisma.module';
import { BannerModule } from './api/banner/banner.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProfileModule } from './api/profile/profile.module';
import { MusicModule } from './api/music/music.module';

@Module({
  imports: [ServeStaticModule.forRoot(
    {
      rootPath: join(__dirname, '..', '..', 'public', 'images', 'banner-image'),
      serveRoot: '/images',
    },
    {
      rootPath: join(__dirname, '..', '..', 'public', 'images', 'avatarUrl'),
      serveRoot: '/images',
    },
    {
      rootPath: join(__dirname, '..', '..', 'public', 'images', 'file'),
      serveRoot: '/images',
    },
    {
      rootPath: join(__dirname, '..', '..', 'public', 'images', 'saffron'),
      serveRoot: '/images',
    },
    {
      rootPath: join(__dirname, '..', '..', 'public', 'images', 'alto'),
      serveRoot: '/images',
    },
    {
      rootPath: join(__dirname, '..', '..', 'public', 'images', 'tenor'),
      serveRoot: '/images',
    },
    {
      rootPath: join(__dirname, '..', '..', 'public', 'images', 'bass'),
      serveRoot: '/images',
    },
    // renderPath: '',
    // exclude: ['/api/*'],
    // serveStaticOptions: {
    //   fallthrough: true,
    // },
    // useGlobalPrefix: false,
  ), AuthModule, PrismaModule, BannerModule, ProfileModule, MusicModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
