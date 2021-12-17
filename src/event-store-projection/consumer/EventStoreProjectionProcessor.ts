import {LoggerContext} from 'a24-logzio-winston';
import {random, toNumber} from 'lodash';
import {PubSubMessageMetaDataInterface} from 'PubSubMessageMetaDataInterface';
import {EventStoreModelInterface} from '../../models/EventStore';
import {EventStoreProjection} from '../../models/EventStoreProjection';
const CONSUMER_NAME = process.argv[2];
const MIN_DELAY = toNumber(process.argv[3]);
const MAX_DELAY = toNumber(process.argv[4]);

interface MessageInterface {
  event: EventStoreModelInterface;
  published_at: string;
}

module.exports = async (
  logger: LoggerContext,
  message: MessageInterface,
  metadata: PubSubMessageMetaDataInterface,
  callback: (error?: Error) => void
) => {
  logger.debug('event received', message);
  const receivedAt = new Date();
  const publishedAt = new Date(message.published_at);
  const delay = random(MIN_DELAY, MAX_DELAY);

  setTimeout(() => {
    const consumedAt = new Date();

    EventStoreProjection.create(
      {
        event: message.event,
        published_at: publishedAt,
        received_at: receivedAt,
        consumed_at: consumedAt,
        process_duration: consumedAt.getTime() - receivedAt.getTime(),
        receive_duration: receivedAt.getTime() - publishedAt.getTime(),
        consumer_instance: CONSUMER_NAME
      },
      (err) => {
        if (err) {
          logger.error('error creating event store projection record', err);
          return callback(err);
        }
        return callback();
      }
    );
  }, delay);
};
