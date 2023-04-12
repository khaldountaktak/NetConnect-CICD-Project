// import { Test, TestingModule } from '@nestjs/testing';
// import { Neo4jService } from './neo4j.service';

// describe('Neo4jService', () => {
//   let service: Neo4jService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [Neo4jService],
//     }).compile();

//     service = module.get<Neo4jService>(Neo4jService);
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
