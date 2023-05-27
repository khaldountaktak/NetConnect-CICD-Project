import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Neo4jTestingModule } from '../../test/neo4j.testing.module';
import { EncryptionService } from '../encryption/encryption.service';
import { ConfigModule } from '@nestjs/config';
import { Neo4jService } from '../neo4j/neo4j.service';
import neo4j from 'neo4j-driver'
describe('UserService', () => {
  let userService: UserService;
  let neo4jService: Neo4jService;
  let encryptionService: EncryptionService;
  const {types} = neo4j;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
    imports: [Neo4jTestingModule,ConfigModule],
      providers: [UserService,EncryptionService],
      
    }).compile();

    userService = module.get<UserService>(UserService);
    encryptionService= module.get<EncryptionService>(EncryptionService)
    neo4jService= module.get<Neo4jService>(Neo4jService)
  });
  const testUserEmail= 'peter.hamouda@familyguy.com'
  afterEach(async () => {
    // Delete the test user after each test case
    await neo4jService.write(
      `MATCH (u:User { email: $email }) DELETE u`,
      { email: testUserEmail }
    );
  });
  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

    // it('should create a user and return it', async () => {
    //   const user = {
    //     firstName: 'peter',
    //     lastName: 'griffin',
    //     email: 'peter.hamouda@familyguy.com',
    //     password: 'familyguy',
    //     dateOfBirth: types.Date.fromStandardDate(new Date('1966-09-22')),
    //     gender: 'male',
    //   }
    //   jest.spyOn(encryptionService,'hash').mockResolvedValue('hashedPassword')
    //   const result= await userService.create(
    //     user.firstName,
    //     user.lastName,
    //     user.email,
    //     user.password,
    //     new Date(1966, 8, 22) ,
    //     user.gender,
    // )

    // expect(result.properties).toEqual({
    //   ...user,
    //   dateOfBirth: user.dateOfBirth.toISOString() // compare date as string
    // });
    
    // expect(encryptionService.hash).toHaveBeenCalledWith(user.password);
    //   expect(neo4jService).toHaveBeenCalledWith(  `CREATE (u:User) SET u.id = randomUUID(), u += $properties RETURN u`,  {
    //     properties: {
    //       firstName: user.firstName,
    //       lastName: user.lastName,
    //       email: user.email,
    //       password: 'hashedPassword',
    //       dateOfBirth: (user.dateOfBirth),
    //       gender: user.gender,
    //     },
    //   },)
    // })





});
