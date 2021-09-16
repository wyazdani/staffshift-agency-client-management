import config from "config";
import * as jwt from 'jsonwebtoken';
const secret: string = config.get('api_token');
export function getJWT(payload: object = {}): string {
  return jwt.sign(payload, secret);
}