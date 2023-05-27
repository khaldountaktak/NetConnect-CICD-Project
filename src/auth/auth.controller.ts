import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Post('register')
  async postRegister(
    @Body() createUserDto: CreateUserDto,
  ) {
    const user = await this.userService.create(
      createUserDto.email,
      createUserDto.password,
      new Date(createUserDto.dateOfBirth),
      createUserDto.firstName,
      createUserDto.lastName,
    );

    // return {
    //   user: user.properties,
    // };
        return this.authService.createToken(user)
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async postLogin(@Request() request) {
    return  this.authService.createToken(request.user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Request() request) {
    const { id, email, firstName, lastName } = request.user.properties;

    return { id, email, firstName, lastName };
  }
}
