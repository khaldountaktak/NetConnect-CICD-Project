import { Neo4jConfig } from 'src/neo4j-config/neo4j-config.interface';
import neo4j, { Driver  } from 'neo4j-driver';
export const createDriver = async (config: Neo4jConfig) => {
  const driver: Driver = neo4j.driver(
    `${config.scheme}://${config.host}:${config.port}`,
    neo4j.auth.basic(config.username, config.password),
  );

  const session = driver.session();
session
  .run('RETURN 1')
  .then(() => {
    console.log('Driver is connected to the database');
  })
  .catch((error) => {
    console.error('Failed to connect to the database', error);
  })
  .finally(() => {
    session.close();
  });

  return driver;
};
