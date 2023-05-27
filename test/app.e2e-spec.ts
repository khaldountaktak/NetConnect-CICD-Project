import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Use Validation Pipe
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(() => app.close());

  describe('Auth', () => {
    let token;
    describe('POST /auth/register', () => {
      it('should NOT validate request for bad password', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .set('Accept', 'application/json')
          .send({
            firstName: 'peter',
            lastName: 'priffin',
            email: 'peter.griffin@familyguy.com',
            dateOfBirth: '1966-09-22',
            gender: 'male',
          })
          .expect(400)
          .expect((res) => {
            console.log(res.body);
          });
      });
      it('should create user request and return JWT token', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .set('Accept', 'application/json')
          .send({
            firstName: 'peter',
            lastName: 'griffin',
            email: 'peter.griffin@familyguy.com',
            password: 'familyguy',
            dateOfBirth: '1966-09-22',
            gender: 'male',
          })
          .expect(201)
          .expect((res) => {
            console.log(res.body);
          });
      });
    });
    describe('POST /auth/login', () => {
      it('should return 401 status on bad username', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .set('Accept', 'application/json')
          .send({
            email: 'unknown@example.com',
            password: 'incorrect',
          })
          .expect(401)
          .expect((res) => {
            console.log(res.body);
          });
      });
      it('should return 401 status on bad password', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .set('Accept', 'application/json')
          .send({
            email: 'peter.griffin@familyguy.com',
            password: 'incorrect',
          })
          .expect(401)
          .expect((res) => {
            console.log(res.body);
          });
      });

      it('should return a JWT token on successful login', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .set('Accept', 'application/json')
          .send({
            email: 'peter.griffin@familyguy.com',
            password: 'familyguy',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body.access_token).toBeDefined();
            token = res.body.access_token;
            console.log(token);
          });
      });
    });
    describe('GET /auth/user', () => {
      it('should authenticate user with the JWT token', () => {
        return request(app.getHttpServer())
          .get('/auth/user')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.email).toEqual('peter.griffin@familyguy.com');
            console.log(res.body);
          });
      });
      it('should return error if no JWT supplied', () => {
        return request(app.getHttpServer()).get('/auth/user').expect(401);
      });

      it('should return error if incorrect JWT supplied', () => {
        return request(app.getHttpServer())
          .get('/auth/user')
          .set('Authorization', `Bearer ${token.replace(/[0-9]+/g, 'X')}`)
          .expect(401)
          .expect((res) => {
            console.log(res.body);
          });
      });
    });
  });
});
