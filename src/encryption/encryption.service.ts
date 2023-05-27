import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';

@Injectable()
export class EncryptionService {
  constructor(private readonly config: ConfigService) {}

  async hash(plain: string): Promise<string> {
    // return hash(plain, this.config.get<number>('HASH_ROUNDS', 10));
    return hash(plain, 10);
  }

  async compare(plain: string, encrypted: string): Promise<boolean> {
    return compare(plain, encrypted);
  }
}
