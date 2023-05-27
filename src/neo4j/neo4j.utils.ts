import neo4j from 'neo4j-driver';
import { Neo4jConfig } from './neo4j-config/neo4j-config.interface';

export const createDriver = async (config: Neo4jConfig) => {
  const driver = await neo4j.driver(
    `${config.scheme}://${config.host}:${config.port}`,
    neo4j.auth.basic(config.username, config.password),
  );

  //   await driver.verifyConnectivity();

  return driver;
};
