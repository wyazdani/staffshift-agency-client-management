import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {ServerResponse} from 'http';

/**
 * Gets the status of the service
 *
 * @param req - The http request object
 * @param res - The http response object
 */
export const getSystemStatus = (req: SwaggerRequestInterface, res: ServerResponse): void => {
  const objStatus = {
    'up_time': Math.floor(process.uptime())
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(objStatus));
};
