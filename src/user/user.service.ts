import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';
import { Node, types } from 'neo4j-driver';
import { EncryptionService } from '../encryption/encryption.service';

export type User = Node;

@Injectable()
export class UserService {
  
  constructor(private readonly neo4jService: Neo4jService, private readonly encryptionService: EncryptionService) {}

  async create(email: string, password: string, dateOfBirth: Date, firstName?: string, lastName?: string): Promise<User> {
    const res = await this.neo4jService.write(`CREATE (u:User) SET u.id = randomUUID(), u += $properties RETURN u`, {
      properties: {
        email,
        password: await this.encryptionService.hash(password),
        firstName,
        lastName,
        dateOfBirth: types.Date.fromStandardDate(dateOfBirth),
      }
    })

    return res.records[0].get('u');
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const res = await this.neo4jService.read(`MATCH (u:User {email: $email}) RETURN u`, { email })
  
    return res.records.length ? res.records[0].get('u') : undefined;
  }
}