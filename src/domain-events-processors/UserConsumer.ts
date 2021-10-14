import {UserUpdateDomainEventDataInterface} from 'UserUpdateDomainEventDataInterface';
import {LoggerContext} from 'a24-logzio-winston';
import {v4 as uuidv4} from 'uuid';
import {FacadeClientHelper} from '../helpers/FacadeClientHelper';
import {DomainEventMessageInterface} from 'DomainEventTypes/DomainEventMessageInterface';
import {PubSubMessageMetaDataInterface} from 'PubSubMessageMetaDataInterface';
import {ConsultantNameChangeProcessor} from './ConsultantNameChangeProcessor';

const process = async (
  logger: LoggerContext,
  message: DomainEventMessageInterface<UserUpdateDomainEventDataInterface>
) => {
  const eventName = message.event.name;
  const correlationId = uuidv4();

  logger.info('Handling incoming domain event', {correlation_id: correlationId, event_id: message.event.id});

  switch (eventName) {
    case 'user_updated':
    case 'user_sync':
      const facadeClientHelper = new FacadeClientHelper(logger);
      const handler = new ConsultantNameChangeProcessor(logger, facadeClientHelper);

      return await handler.process(message.event_data);
    default:
      logger.info('UnHandled Agency Client Event', {event_name: eventName});
  }
};

module.exports = async (
  logger: LoggerContext,
  message: DomainEventMessageInterface<UserUpdateDomainEventDataInterface>,
  metadata: PubSubMessageMetaDataInterface,
  callback: (error?: Error) => void
): Promise<void> => {
  process(logger, message)
    .then(() => callback())
    .catch((err) => callback(err));
};
