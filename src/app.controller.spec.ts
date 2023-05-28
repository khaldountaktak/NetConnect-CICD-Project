import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jTestingModule } from '../test/neo4j.testing.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [Neo4jTestingModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello"', async () => {
      console.log('Testing getHello()');
      const result = await appController.getHello();
      console.log('Result:', result);
      expect(result).toBeTruthy();
    });
  });
});
