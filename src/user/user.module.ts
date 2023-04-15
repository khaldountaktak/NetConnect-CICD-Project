import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Module({
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
