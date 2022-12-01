import {ObjectId} from 'mongodb';
import {SinonStub} from 'sinon';
import sinon, {stubInterface} from 'ts-sinon';
import {AgencyClientCommandEnum} from '../../src/aggregates/AgencyClient/types';
import {CommandBus} from '../../src/aggregates/CommandBus';
import {ConsultantJobCommandEnum} from '../../src/aggregates/ConsultantJob/types';
import {ConsultantJobProcessCommandEnum} from '../../src/aggregates/ConsultantJobProcess/types';
import {EventRepository} from '../../src/EventRepository';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';

describe('CommandBus', () => {
  /**
   * We did not write test cases for constructor and registerAggregateCommandHandlers
   * Since it was complicated and also it will be covered in out endpoint testcases
   */
  let execute: SinonStub;
  let commandBus: CommandBus;

  beforeEach(() => {
    const eventRepository = stubInterface<EventRepository>();

    commandBus = new CommandBus(eventRepository, TestUtilsLogger.getLogger(sinon.spy()));

    execute = sinon.stub(commandBus, 'execute').resolves();
  });
  afterEach(() => {
    sinon.restore();
  });
  it('startConsultantJobProcess()', async () => {
    const aggregateId: any = {id: 'ok'};

    await commandBus.startConsultantJobProcess(aggregateId, 2);
    execute.should.have.been.calledOnceWith({
      aggregateId,
      type: ConsultantJobProcessCommandEnum.START,
      data: {
        estimated_count: 2
      }
    });
  });
  it('succeedItemConsultantJobProcess()', async () => {
    const aggregateId: any = {id: 'ok'};

    await commandBus.succeedItemConsultantJobProcess(aggregateId, {client_id: 'A', consultant_role_id: 'B'});
    execute.should.have.been.calledOnceWith({
      aggregateId: aggregateId,
      type: ConsultantJobProcessCommandEnum.SUCCEED_ITEM,
      data: {
        client_id: 'A',
        consultant_role_id: 'B'
      }
    });
  });

  it('completeConsultantJobProcess()', async () => {
    const aggregateId: any = {id: 'ok'};

    await commandBus.completeConsultantJobProcess(aggregateId);
    execute.should.have.been.calledOnceWith({
      aggregateId,
      type: ConsultantJobProcessCommandEnum.COMPLETE,
      data: {}
    });
  });
  it('failItemConsultantJobProcess()', async () => {
    const aggregateId: any = {id: 'ok'};

    await commandBus.failItemConsultantJobProcess(aggregateId, {
      client_id: 'A',
      errors: []
    });
    execute.should.have.been.calledOnceWith({
      aggregateId: aggregateId,
      type: ConsultantJobProcessCommandEnum.FAIL_ITEM,
      data: {
        client_id: 'A',
        errors: []
      }
    });
  });

  it('addAgencyClientConsultant()', async () => {
    const aggregateId: any = {id: 'ok'};

    sinon.stub(ObjectId.prototype, 'toString').returns('MM');
    await commandBus.addAgencyClientConsultant(aggregateId, 'A', 'B');
    execute.should.have.been.calledOnceWith({
      aggregateId,
      type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
      data: {
        _id: 'MM',
        consultant_role_id: 'A',
        consultant_id: 'B'
      }
    });
  });
  it('removeAgencyClientConsultant()', async () => {
    const aggregateId: any = {id: 'ok'};

    await commandBus.removeAgencyClientConsultant(aggregateId, 'MM');
    execute.should.have.been.calledOnceWith({
      aggregateId,
      type: AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT,
      data: {
        _id: 'MM'
      }
    });
  });
  it('completeAssignConsultant()', async () => {
    const aggregateId: any = {id: 'ok'};

    await commandBus.completeAssignConsultant(aggregateId, 'A');
    execute.should.have.been.calledOnceWith({
      aggregateId,
      type: ConsultantJobCommandEnum.COMPLETE_ASSIGN_CONSULTANT,
      data: {_id: 'A'}
    });
  });

  it('completeUnassignConsultant()', async () => {
    const aggregateId: any = {id: 'ok'};

    await commandBus.completeUnassignConsultant(aggregateId, 'A');
    execute.should.have.been.calledOnceWith({
      aggregateId,
      type: ConsultantJobCommandEnum.COMPLETE_UNASSIGN_CONSULTANT,
      data: {_id: 'A'}
    });
  });

  it('completeTransferConsultant()', async () => {
    const aggregateId: any = {id: 'ok'};

    await commandBus.completeTransferConsultant(aggregateId, 'A');
    execute.should.have.been.calledOnceWith({
      aggregateId,
      type: ConsultantJobCommandEnum.COMPLETE_TRANSFER_CONSULTANT,
      data: {_id: 'A'}
    });
  });

  it('transferAgencyClientConsultant()', async () => {
    const aggregateId: any = {id: 'ok'};
    const commandData: any = {ok: 'oops'};

    await commandBus.transferAgencyClientConsultant(aggregateId, commandData);
    execute.should.have.been.calledOnceWith({
      aggregateId,
      type: AgencyClientCommandEnum.TRANSFER_AGENCY_CLIENT_CONSULTANT,
      data: commandData
    });
  });
});
