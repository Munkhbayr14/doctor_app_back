import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { PrismaModule } from './api/prisma/prisma.module';
import { BannerModule } from './api/banner/banner.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', '..', 'public', 'images', 'banner-image'),
    serveRoot: '/images',
    // renderPath: '',
    // exclude: ['/api/*'],
    // serveStaticOptions: {
    //   fallthrough: true,
    // },
    // useGlobalPrefix: false,
  }), AuthModule, PrismaModule, BannerModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
