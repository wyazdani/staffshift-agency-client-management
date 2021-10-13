export interface HttpServiceConfigurationInterface {
  api_token?: string;
  request_timeout: number;
  request_options: {
    protocol: string;
    host: string;
    port: number;
    version: string;
  };
}
