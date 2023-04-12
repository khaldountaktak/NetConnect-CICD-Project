// import { Test, TestingModule } from '@nestjs/testing';
// import { EncryptionService } from './encryption.service';

// describe('EncryptionService', () => {
//   let service: EncryptionService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [EncryptionService],
//     }).compile();

//     service = module.get<EncryptionService>(EncryptionService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

describe('Calculator tests', () => {
  test('adding 1 + 2 should return 3', () => {
    // arrange and act
    var result = 1 + 2;

    // assert
    expect(result).toBe(3);
  });
});
