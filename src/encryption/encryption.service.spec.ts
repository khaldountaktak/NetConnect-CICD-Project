import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService, ConfigService],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should return a string', async () => {
    const plain = 'password';
    const hash = await service.hash(plain);
    expect(typeof hash).toBe('string');
  });

  it('should return different outputs', async () => {
    const pass1 = 'pass1';
    const pass2 = 'pass2';
    const hash1 = service.hash(pass1);
    const hash2 = service.hash(pass2);
    expect(hash1).not.toBe(hash2);
  });

  it('should return true for matching strings after being compared', async () => {
    const pass1 = 'pass1';
    const hash1 = await service.hash(pass1);
    expect(await compare(pass1, hash1)).toBe(true);
  });

  it('should return false for non matching plain texts', async () => {
    const pass1 = 'p';
    const pass2 = 'd';
    const hash1 = await service.hash(pass1);
    const match = await compare(pass2, hash1);
    expect(match).toBe(false);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
