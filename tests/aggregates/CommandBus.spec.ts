import {ObjectID} from 'mongodb';
import {SinonStub} from 'sinon';
import sinon, {stubInterface} from 'ts-sinon';
import {AgencyClientCommandEnum} from '../../src/aggregates/AgencyClient/types';
import {CommandBus} from '../../src/aggregates/CommandBus';
import {ConsultantJobCommandEnum} from '../../src/aggregates/ConsultantJob/types';
import {ConsultantJobAssignCommandEnum} from '../../src/aggregates/ConsultantJobAssign/types';
import {EventRepository} from '../../src/EventRepository';

describe('CommandBus', () => {
  /**
   * We did not write test cases for constructor and registerAggregateCommandHandlers
   * Since it was complicated and also it will be covered in out endpoint testcases
   */
  let execute: SinonStub;
  let commandBus: CommandBus;

  beforeEach(() => {
    const eventRepository = stubInterface<EventRepository>();

    commandBus = new CommandBus(eventRepository);

    execute = sinon.stub(commandBus, 'execute').resolves();
  });
  afterEach(() => {
    sinon.restore();
  });
  it('startConsultantJobAssign()', async () => {
    const aggregateId: any = {id: 'ok'};

    await commandBus.startConsultantJobAssign(aggregateId);
    execute.should.have.been.calledWith({
      aggregateId,
      type: ConsultantJobAssignCommandEnum.START,
      data: {}
    });
  });
  it('succeedItemConsultantJobAssign()', async () => {
    const aggregateId: any = {id: 'ok'};

    await commandBus.succeedItemConsultantJobAssign(aggregateId, 'A');
    execute.should.have.been.calledWith({
      aggregateId: aggregateId,
      type: ConsultantJobAssignCommandEnum.SUCCEED_ITEM,
      data: {
        client_id: 'A'
      }
    });
  });

  it('completeConsultantJobAssign()', async () => {
    const aggregateId: any = {id: 'ok'};

    await commandBus.completeConsultantJobAssign(aggregateId);
    execute.should.have.been.calledWith({
      aggregateId,
      type: ConsultantJobAssignCommandEnum.COMPLETE,
      data: {}
    });
  });
  it('succeedItemConsultantJobAssign()', async () => {
    const aggregateId: any = {id: 'ok'};

    await commandBus.failItemConsultantJobAssign(aggregateId, {
      client_id: 'A',
      errors: []
    });
    execute.should.have.been.calledWith({
      aggregateId: aggregateId,
      type: ConsultantJobAssignCommandEnum.FAIL_ITEM,
      data: {
        client_id: 'A',
        errors: []
      }
    });
  });

  it('addAgencyClientConsultant()', async () => {
    const aggregateId: any = {id: 'ok'};

    sinon.stub(ObjectID.prototype, 'toString').returns('MM');
    await commandBus.addAgencyClientConsultant(aggregateId, 'A', 'B');
    execute.should.have.been.calledWith({
      aggregateId,
      type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
      data: {
        _id: 'MM',
        consultant_role_id: 'A',
        consultant_id: 'B'
      }
    });
  });
  it('completeAssignConsultant()', async () => {
    const aggregateId: any = {id: 'ok'};

    await commandBus.completeAssignConsultant(aggregateId, 'A');
    execute.should.have.been.calledWith({
      aggregateId,
      type: ConsultantJobCommandEnum.COMPLETE_ASSIGN_CONSULTANT,
      data: {_id: 'A'}
    });
  });
});
