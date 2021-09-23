import config from 'config';
import supertest from 'supertest';

const {host, port, protocol, version} = config.get('exposed_server');

export const api = supertest(`${protocol}://${host}:${port}/${version}`);
