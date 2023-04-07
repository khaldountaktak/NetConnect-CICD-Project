import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async postRegister(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.email,
      createUserDto.password,
      new Date(createUserDto.dateOfBirth),
      createUserDto.gender,
    );

    return this.authService.createToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Request() request) {
    const { id, firstName, lastName, email } = request.user.properties;

    return { id, firstName, lastName, email };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async postLogin(@Request() request) {
    return await this.authService.createToken(request.user);
  }
}
