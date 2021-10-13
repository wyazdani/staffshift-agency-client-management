import {MongoClientOptions} from 'mongodb';

export interface MongoConfigurationInterface {
  database_host: string;
  options: MongoClientOptions;
}
