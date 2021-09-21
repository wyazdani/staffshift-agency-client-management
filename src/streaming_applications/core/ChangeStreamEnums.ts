/**
 * Custom and Mongo change stream event enums
 *
 * @see https://docs.mongodb.com/manual/reference/change-events/
 */
export enum CHANGE_STREAM_EVENTS_ENUM {
  SEED = 'seed',
  SYNC = 'sync',
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete'
}

/**
 * Enums reflecting the pipeline types that are supported
 */
export enum PIPELINE_TYPES_ENUM {
  CORE = 'core',
  ENRICHMENT = 'enrichment'
}

/**
 * Enums reflecting the stream types
 */
export enum STREAM_TYPES_ENUM {
  WATCH = 'watch',
  SEED = 'seed'
}