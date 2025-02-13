import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { PrismaModule } from './api/prisma/prisma.module';
import { BannerModule } from './api/banner/banner.module';

@Module({
  imports: [AuthModule, PrismaModule, BannerModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
