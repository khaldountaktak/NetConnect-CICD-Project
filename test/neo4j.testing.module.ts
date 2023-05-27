import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from '../src/neo4j/neo4j.module';
import { Driver } from 'neo4j-driver';

@Module({
    imports: [ 
      Neo4jModule.forRootAsync({
        imports: [ConfigModule.forRoot({
            isGlobal: true,
        })],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          // console.log('Creating Neo4j driver with config', {
          //   scheme: configService.get('NEO4J_SCHEME'),
          //   host: configService.get('NEO4J_HOST'),
          //   port: configService.get<number>('NEO4J_PORT'),
          //   username: configService.get('NEO4J_USERNAME'),
          //   password: configService.get('NEO4J_PASSWORD'),
          //   database: configService.get('NEO4J_DATABASE'),
          // });
          return {
            scheme: configService.get('NEO4J_SCHEME'),
            host: configService.get('NEO4J_HOST'),
            port: configService.get<number>('NEO4J_PORT'),
            username: configService.get('NEO4J_USERNAME'),
            password: configService.get('NEO4J_PASSWORD'),
            database: configService.get('NEO4J_DATABASE'),
          };
        },
      }),
    ],
  })
  
export class Neo4jTestingModule {}
