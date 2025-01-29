import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { PrismaModule } from './api/prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
