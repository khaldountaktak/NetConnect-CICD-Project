import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from './neo4j.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NEO4J_CONFIG, NEO4J_DRIVER } from './neo4j.constants';
import { Neo4jConfig } from 'src/neo4j-config/neo4j-config.interface';
import { createDriver } from './neo4j.util';
import { Driver } from 'neo4j-driver';
import { Provider } from '@nestjs/common';

describe('Neo4jService', () => {
  let service: Neo4jService;
  let configService: ConfigService;
  let driver: Driver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({
        isGlobal: true,
      })],
      providers: [
        Neo4jService,
        {
          provide: NEO4J_CONFIG,
          useFactory: (configService: ConfigService) => ({
            scheme: configService.get('NEO4J_SCHEME'),
            host: configService.get('NEO4J_HOST'),
            port: configService.get('NEO4J_PORT'),
            username: configService.get('NEO4J_USERNAME'),
            password: configService.get('NEO4J_PASSWORD'),
            database: configService.get('NEO4J_DATABASE'),
          }),
          inject: [ConfigService],
        },
        {
          provide: NEO4J_DRIVER,
          useFactory: async (config: Neo4jConfig) => {
            return createDriver(config);
          },
          inject: [NEO4J_CONFIG],
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    service = module.get<Neo4jService>(Neo4jService);
    driver = module.get<Driver>(NEO4J_DRIVER);
  });

  afterEach(async () => {
    await driver.close();
  });

  it('should return the correct config object', () => {
    expect(service.getConfig()).toEqual({
      scheme: 'neo4j',
      host: 'localhost',
      port: '7687',
      username: 'neo4j',
      password: 'neo',

    });
  });

  it('should return a valid driver object', () => {
    expect(service.getDriver()).toBeInstanceOf(Driver);
  });

  // it('should return a valid read session object with the correct access mode', () => {
  //   const session = service.getReadSession();
  //   expect(session).toBeDefined();
  //   expect(session.mode).toEqual(neo4j.session.READ);
  // });
  // it('should return a valid write session object with the correct access mode', () => {
  //   const session = service.getWriteSession();
  //   expect(session).toBeDefined();
  //   expect(session.mode).toEqual(neo4j.session.WRITE);
  // });
  it('should create a read session', () => {
    const readSession = service.getReadSession();
    expect(readSession).toBeDefined();
  });

  it('should create a write session', () => {
    const writeSession = service.getWriteSession();
    expect(writeSession).toBeDefined();
  });

  it('should read data from the database', async () => {
    // Create a Person node in the database
    const createResult = await service.write(
      'CREATE (n:Person { name: $name }) RETURN n',
      { name: 'Alice' },
    );
  
    // Read the Person node from the database
    const readResult = await service.read(
      'MATCH (n:Person { name: $name }) RETURN n',
      { name: 'Alice' },
    );
  
    // Assert that the read result contains one record with a Person node
    expect(readResult.records).toHaveLength(1);
    expect(readResult.records[0].get('n').properties.name).toEqual('Alice');
  
    // Clean up by deleting the Person node from the database
    await service.write(
      'MATCH (n:Person { name: $name }) DELETE n',
      { name: 'Alice' },
    );
  });
  
  it('should create a new node', async () => {
    const result = await service.write(
      'CREATE (n:TestNode {name: $name}) RETURN n',
      { name: 'Test' }
    );
    expect(result.records.length).toEqual(1);
    expect(result.records[0].get('n').properties.name).toEqual('Test');
  });
  
  

  it('should connect to the database', async () => {
    const result = await service.read(
      'MATCH (n) RETURN count(n) as count',
      {},
    );
    expect(result.records[0].get('count').toNumber()).toBeGreaterThan(0);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
