import config from 'config';
import {sign} from 'jsonwebtoken';
import {GenericObjectInterface} from '../../src/types/GenericObjectInterface';

const secret: string = config.get<string>('api_token');

export const getJWT = (payload: GenericObjectInterface = {}): string => sign(payload, secret);
