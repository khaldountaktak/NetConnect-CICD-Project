// import { Test, TestingModule } from '@nestjs/testing';
// import { UserService } from './user.service';

// describe('UserService', () => {
//   let service: UserService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [UserService],
//     }).compile();

//     service = module.get<UserService>(UserService);
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
