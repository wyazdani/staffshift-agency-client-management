import {LoggerContext} from 'a24-logzio-winston';
import {random, toNumber} from 'lodash';
import {PubSubMessageMetaDataInterface} from 'PubSubMessageMetaDataInterface';
import {EventStoreModelInterface} from '../../models/EventStore';
import {EventStoreProjection} from '../../models/EventStoreProjection';
const NACK = 'NACK';
const TIMEOUT = 'TIMEOUT';
const CRASH = 'CRASH';

const SUBSCRIBER_TIMEOUT = 10000;
const CONSUMER_NAME = process.argv[2];
const MIN_DELAY = toNumber(process.argv[3]);
const MAX_DELAY = toNumber(process.argv[4]);
const CHAOS_CODES = process.argv[5].split(',');
const DELAY = random(MIN_DELAY, MAX_DELAY);
const MAX_MESSAGES = random(10, 100);

let handledMessages = 0;

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

  handledMessages++;
  setTimeout(() => {
    if (handledMessages > MAX_MESSAGES && CHAOS_CODES.includes(CRASH)) {
      logger.info('CHAOS_CODE::CRASH invoked for event', {consumer: CONSUMER_NAME, event_id: message.event._id.toString()});
      process.exit(1);
    }

    if (DELAY % 9 == 0 && CHAOS_CODES.includes(NACK)) {
      const err = new Error(`CHAOS_CODE::NACK invoked for event ${message.event._id.toString()}`);

      logger.info('CHAOS::NACK invoked for event', {consumer: CONSUMER_NAME, original_error: err, event_id: message.event._id.toString()});
      return callback(err);
    }

    if (DELAY % 8 == 0 && CHAOS_CODES.includes(TIMEOUT)) {
      logger.info('CHAOS_CODE::TIMEOUT invoked for event', {consumer: CONSUMER_NAME, event_id: message.event._id.toString()});
      setTimeout(() => {
        logger.info('CHAOS_CODE::TIMEOUT executed for event', {consumer: CONSUMER_NAME, event_id: message.event._id.toString()});
        return callback();
      }, SUBSCRIBER_TIMEOUT);
      return;
    }

    const consumedAt = new Date();

    EventStoreProjection.create(
      {
        event: message.event,
        published_at: publishedAt,
        received_at: receivedAt,
        consumed_at: consumedAt,
        process_duration_in_ms: consumedAt.getTime() - receivedAt.getTime(),
        receive_duration_in_ms: receivedAt.getTime() - publishedAt.getTime(),
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
  }, DELAY);
};
