import config from 'config';
import {sign} from 'jsonwebtoken';

const secret: string = config.get<string>('api_token');

export const getJWT = (payload: any = {}): string => sign(payload, secret);
