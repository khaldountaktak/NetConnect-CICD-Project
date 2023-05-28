import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EncryptionService } from '../encryption/encryption.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Neo4jService } from '../neo4j/neo4j.service';
import { Neo4jTestingModule } from '../../test/neo4j.testing.module';
describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let encryptionService: EncryptionService;
  let jwtService: JwtService;
  let neo4jService: Neo4jService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'mySecret',
        }),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        Neo4jTestingModule,
      ],
      providers: [
        AuthService,
        UserService,
        ConfigService,
        EncryptionService,
        JwtService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    encryptionService = module.get<EncryptionService>(EncryptionService);
    jwtService = module.get<JwtService>(JwtService);
    neo4jService = module.get<Neo4jService>(Neo4jService);
  });

  it('should return a user if valid credentials are provided', async () => {
    const result = await neo4jService.read(
      'MATCH (u:User {email: $email}) RETURN u',
      { email: 'peter.griffin@familyguy.com' },
    );
    const node = result.records[0].get('u');
    const email = 'peter.griffin@familyguy.com';
    const password = 'familyguy';
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(node);
    jest.spyOn(encryptionService, 'compare').mockResolvedValue(true);
    const user = await authService.validateUser(email, password);
    expect(user).toBe(node);
  });
  it('should return a null if incoorect credentials are provided', async () => {
    const result = await neo4jService.read(
      'MATCH (u:User {email: $email}) RETURN u',
      { email: 'peter.griffin@familyguy.com' },
    );
    const node = result.records[0].get('u');
    const email = 'peter.griffin@familyguy.com';
    const password = 'familygay';
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(node);
    jest.spyOn(encryptionService, 'compare').mockResolvedValue(false);
    const user = await authService.validateUser(email, password);
    expect(user).toBeNull();
  });

  describe('createToken', () => {
    it('should return a valid access token', async () => {
      const node = await neo4jService.read(
        'MATCH (u:User {email: $email}) RETURN u',
        { email: 'peter.griffin@familyguy.com' },
      );
      const user = node.records[0].get('u');

      const token = await authService.createToken(user);
      // console.log(token);

      const decodedToken = jwtService.verify(token.access_token);

      expect(decodedToken.sub).toEqual(user.properties.id);
      expect(decodedToken.email).toEqual(user.properties.email);
      // add more checks as needed
    });
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
