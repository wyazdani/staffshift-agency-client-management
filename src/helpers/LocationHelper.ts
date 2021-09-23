import * as config from 'config';
const {version} = config.get('exposed_server');

export class LocationHelper {
  /**
   * gets relative location for the path
   *
   * @param path - path to create the relative url
   */
  static getRelativeLocation(path: string): string {
    return `/${version}${path}`;
  }
}