import {Transform, TransformCallback, TransformOptions} from 'stream';
import {LoggerContext} from 'a24-logzio-winston';
import {EventStoreChangeStreamFullDocumentInterface} from 'EventStoreChangeStreamFullDocumentInterface';
import {MessagePublisher} from 'a24-node-pubsub';
const TOPIC_NAME = 'ss.staffshift.agency.client.management.event.store';

interface ProjectionTransformerOptionsInterface extends TransformOptions {
  pipeline: string;
  logger: LoggerContext;
}

/**
 * Convert an event store entry into the Agency Client Read Projection
 */
export class EventStorePubSubTransformer extends Transform {
  private pipeline: string;
  private logger: LoggerContext;
  private publisher: typeof MessagePublisher;

  constructor(opts: ProjectionTransformerOptionsInterface) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
    this.pipeline = opts.pipeline;
    this.logger = opts.logger;
    this.publisher = new MessagePublisher(this.logger);
  }

  _transform(
    data: EventStoreChangeStreamFullDocumentInterface,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    this.logger.debug('Processing the incoming event', {event: data.event.type});
    this.publisher.send(
      TOPIC_NAME,
      {
        event: data.event,
        published_at: new Date()
      },
      {
        orderingKey: JSON.stringify(data.event.aggregate_id)
      },
      (err: Error) => {
        if (err) {
          this.logger.error('error producing message in eventstore pubsub transformer', err);
          return callback(err);
        }
        callback(null, data);
      }
    );
  }
}
