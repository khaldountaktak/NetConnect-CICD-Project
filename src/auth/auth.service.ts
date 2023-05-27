import { Injectable } from '@nestjs/common';
import { EncryptionService } from '../encryption/encryption.service';
import { User, UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(user: User) {
    const {
        id,
        email,
        dateOfBirth,
        firstName,
        lastName,
    } = <Record<string, any>> user.properties

    return {
        access_token: this.jwtService.sign({
            sub: id,
            email,
            dateOfBirth,
            firstName,
            lastName
        })
    }
}
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (
      user &&
      this.encryptionService.compare(
        password,
        (user.properties as Record<string, any>).password,
      )
    ) {
      return user;
    }

    return null;
  }
}
