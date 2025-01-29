import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }
  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }
  async signup(registerUserDto: RegisterUserDto) {
    const hash = await this.hashData(registerUserDto.password);
    if (registerUserDto.password !== registerUserDto.confirmationPassword) {
      throw new BadRequestException('Баталгаажуулах нууц үг тохирохгүй байна.');
    }
    const userExists = await this.prisma.user.findUnique({
      where: { email: registerUserDto.email },
    })
    if (userExists) {
      throw new BadRequestException('Хэрэглэгч бүртгэлтэй байна.');
    }
    try {
      const userExists = await this.prisma.user.create({
        data: {
          email: registerUserDto.email,
          firstName: registerUserDto.firstname,
          lastName: registerUserDto.lastname,
          // role: registerUserDto.role || undefined,
          hash,
        },
      });
      return {
        message: 'Амжилттай бүртгэгдлээ',
        statusCode: 200,
        userId: userExists.id,
        email: userExists.email,
        firstname: userExists.firstName,
        lastname: userExists.lastName,
        // role: user.role,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException("Хэрэглэгч бүртгэлтэй байна.");
        }
      }
      throw new Error(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginUserDto.email }
    })
    if (!user) {
      throw new UnauthorizedException('Хэрэглэгчийн нэвтрэх нэр эсвэл нууц үг буруу байна!');
    }
    const passwordMatch = await bcrypt.compare(loginUserDto.password, user.hash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Хэрэглэгчийн нэвтрэх нэр эсвэл нууц үг буруу байна!');
    }

    const payload = { email: user.email, userId: user.id, username: user.firstName };
    return {
      statusCode: 200,
      message: "Амжилттай нэвтэрлээ",
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
      userId: user.id,
      email: user.email,
      username: user.firstName,
    };
  }

}
