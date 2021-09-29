import config from 'config';

export class LocationHelper {
  /**
   * gets relative location for the path
   *
   * @param path - path to create the relative url
   */
  static getRelativeLocation(path: string): string {
    const version = config.get<string>('exposed_server.version');

    return `/${version}${path}`;
  }
}
