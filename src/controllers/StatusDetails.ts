import {SwaggerRequest} from 'SwaggerRequest';
import {ServerResponse} from 'http';

module.exports =  {
  /**
   * Gets the status of the service
   * @param req - The http request object
   * @param res - The http response object
   * @param next - The callback used to pass control to the next middleware
   */
  getSystemStatus: (req: SwaggerRequest, res: ServerResponse, next: Function) => {
    const objStatus = {
      'up_time': Math.floor(process.uptime())
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(objStatus));
  }
};