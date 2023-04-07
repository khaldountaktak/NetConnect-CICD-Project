import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from '../encryption/encryption.service';
import { User, UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (
      user !== undefined &&
      (await this.encryptionService.compare(
        password,
        (<Record<string, any>>user.properties).password,
      ))
    ) {
      return user;
    }

    return null;
  }

  // auth.service.ts
  async createToken(user: User) {
    const { id, firstName, lastName, email, dateOfBirth, gender } = <
      Record<string, any>
    >user.properties;

    return {
      access_token: this.jwtService.sign({
        sub: id,
        firstName,
        lastName,
        email,
        dateOfBirth,
        gender,
      }),
    };
  }
}
