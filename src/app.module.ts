import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { Neo4jModule } from './neo4j/neo4j.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EncryptionModule } from './encryption/encryption.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        scheme: configService.get('NEO4J_SCHEME'),
        host: configService.get('NEO4J_HOST'),
        port: configService.get('NEO4J_PORT'),
        username: configService.get('NEO4J_USERNAME'),
        password: configService.get('NEO4J_PASSWORD'),
        // database: configService.get('NEO4J_DATABASE'),
      }),
    }),
    AuthModule,
    UserModule,
    EncryptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
