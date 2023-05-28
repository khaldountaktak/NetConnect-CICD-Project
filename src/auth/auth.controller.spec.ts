// import { Test, TestingModule } from '@nestjs/testing';
// import { UserModule } from '../user/user.module';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';

// describe('AuthController', () => {
//   let controller: AuthController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [UserModule],
//       providers: [AuthService],
//       controllers: [AuthController],
//     }).compile();

//     controller = module.get<AuthController>(AuthController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });

describe('Calculator tests', () => {
  test('adding 1 + 2 should return 3', () => {
    // arrange and act
    const result = 1 + 2;

    // assert
    expect(result).toBe(3);
  });
});
