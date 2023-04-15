import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly userService: UserService){}

    @Post('register')
    async postRegister(@Body() createUserDto: CreateUserDto){
        // TODO
        return createUserDto
    }
    
}
