export class IfMatchHelper {
  /**
   * gets the version for a passed in key
   *
   * @param value - path to create the relative url
   * @param aggregateName - the aggregateName
   */
  static getAggregateVersion(value: string, aggregateName: string): number {
    const aggregates = value.substring(3, value.length - 1).split(';');
    const locks: {[key: string]: number} = aggregates.reduce((prev: {[key: string]: number}, current: string) => {
      const parts: Array<string> = current.split(':');

      prev[parts[0]] = parseInt(parts[1]) as number;
      return prev;
    }, {});

    return locks[aggregateName] !== undefined ? locks[aggregateName] : undefined;
  }
}
