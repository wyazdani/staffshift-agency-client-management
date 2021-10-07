export interface GracefulShutdownConfigurationInterface {
  signals: string[];
  http: {
    delay: number;
    server_close_timeout: number;
  };
  changestream: {
    server_close_timeout: number;
  };
}
