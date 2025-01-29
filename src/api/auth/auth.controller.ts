import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("signup")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lastname: { type: 'string' },
        firstname: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        confirmationPassword: { type: 'string' },
        // role: {
        //   type: 'string',
        //   enum: ['HAB', 'EMPLOYEE',],
        //   example: 'EMPLOYEE || HAB',
        // },
      },
    },
  })
  signup(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.signup(registerUserDto)
  }

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    }
  })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('logout')
  logoutUser(@Req() req) {
    return req.logout();
  }
}
