import { Injectable } from '@nestjs/common';
import { Node, types } from 'neo4j-driver';
import { Neo4jService } from '../neo4j/neo4j.service';
import { EncryptionService } from '../encryption/encryption.service';

export type User = Node;

@Injectable()
export class UserService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: Date,
    gender: string,
  ): Promise<User> {
    const res = await this.neo4jService.write(
      `CREATE (u:User) SET u.id = randomUUID(), u += $properties RETURN u`,
      {
        properties: {
          firstName,
          lastName,
          email,
          password: await this.encryptionService.hash(password),
          dateOfBirth: types.Date.fromStandardDate(dateOfBirth),
          gender,
        },
      },
    );

    return res.records[0].get('u');
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const res = await this.neo4jService.read(
      `MATCH (u:User {email: $email}) RETURN u`,
      { email },
    );

    return res.records.length ? res.records[0].get('u') : undefined;
  }
}
