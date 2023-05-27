import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { createDriver } from '../src/neo4j/neo4j.util';
import { Driver } from 'neo4j-driver';
import { ConfigService } from '@nestjs/config';
import { Neo4jConfig } from 'src/neo4j-config/neo4j-config.interface';
import exp from 'constants';
describe('AppController (e2e)', () => {
  let driver: Driver;
  let app: INestApplication;
  let configService: ConfigService;
  // const email = 'teks@test.com'
  // const password ='0.123456789'
  let token: string;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe())

    configService= moduleFixture.get<ConfigService>(ConfigService)
    const config : Neo4jConfig={
      scheme: configService.get('NEO4J_SCHEME'),
        host: configService.get('NEO4J_HOST'),
        port: configService.get('NEO4J_PORT'),
        username: configService.get('NEO4J_USERNAME'),
        password: configService.get('NEO4J_PASSWORD'),
        database: configService.get('NEO4J_DATABASE'),
    }
     driver = await createDriver(config);

    // Test if the driver is connected
    const session = driver.session();
    try {
      await session.run('RETURN 1');
      console.log('Driver is connected to the database');
    } catch (error) {
      console.error('Failed to connect to the database', error);
    } finally {
      session.close();
    }
    await app.init();


  });

  afterEach(async () => {
    await driver.close();
  })

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });
  // describe('Auth', () => {
  //   describe('POST auth/register' , () => {
  //     it('should validate the incoming request', () => {
  //       return request(app.getHttpServer()).post('/auth/register').set('Accept', 'apllication/json').send({
  //         email: 'test@test.com',
  //         dateOfBirth: '2018-04-04'
  //       }).expect(400).expect(res => {
  //         console.log(res.body);
  //         expect(res.body.message).toContain('password should not be empty')

  //         expect(
  //           res.body.message.find((m: string) => m.startsWith('maximal allowed date for dateOfBirth'))
  //         ).toBeDefined()
  //       })
  //     })
  //     it('correct test now', () => {
  //       const email= `${Math.random()}@gmail.com`
  //       return request(app.getHttpServer()).post('/auth/register').set('Accept', 'application/json')
  //       .send({
  //         email,
  //         firstName: 'Adam',
  //         lastName: 'Cowley',
  //         password: Math.random().toString(),
  //         dateOfBirth: '2000-01-01'
  //       }).expect(201).expect(res => {
  //         console.log(res.body)
  //         expect(res.body.user.email).toEqual(email);
  //       })
  //     })
  //   })
  // })
  // describe('POST /auth/login', () => {
  //   it('should return 401 status on bad username', () => {
  //     return request(app.getHttpServer())
  //       .post('/auth/login')
  //       .set('Accept', 'application/json')
  //       .send({
  //         email: 'unknown@example.com',
  //         password: 'incorrect',
  //       })
  //       .expect(401)
  //   })
  //   it('should return 401 status on bad password', () => {
  //     return request(app.getHttpServer())
  //       .post('/auth/login')
  //       .set('Accept', 'application/json')
  //       .send({
  //         email: 'teks@testss.com',
  //         password: 'incorrect',
  //       })
  //       .expect(401)
  //   })
  
    it('should return a JWT token on successful login', () => {
      return request(app.getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({
        email: 'teks@test.com',
        password: '0.123456789',
      })
      .expect(201)
      .expect(res => {
        expect(res.body.access_token).toBeDefined()
        token = res.body.access_token
      })
    })
  // })

  it('should return error if no JWT supplied', () => {
    return request(app.getHttpServer())
      .get('/auth/user')
      .expect(401)
  })
  
  it('should return error if incorrect JWT supplied', () => {
    return request(app.getHttpServer())
      .get('/auth/user')
      .set('Authorization', `Bearer ${token.replace(/[0-9]+/g, 'X')}`)
      .expect(401)
  })
  afterAll(() => app.close())
});
