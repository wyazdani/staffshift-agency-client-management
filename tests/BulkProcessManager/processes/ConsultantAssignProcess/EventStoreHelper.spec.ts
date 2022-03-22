import {ObjectID} from 'mongodb';
import sinon, {stubInterface, StubbedInstance} from 'ts-sinon';
import {AgencyClientCommandBus} from '../../../../src/aggregates/AgencyClient/AgencyClientCommandBus';
import {AgencyClientCommandEnum} from '../../../../src/aggregates/AgencyClient/types';
import {ConsultantJobCommandBus} from '../../../../src/aggregates/ConsultantJob/ConsultantJobCommandBus';
import {ConsultantJobCommandEnum} from '../../../../src/aggregates/ConsultantJob/types';
import {ConsultantJobAssignCommandBus} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignCommandBus';
import {ConsultantJobAssignRepository} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandEnum} from '../../../../src/aggregates/ConsultantJobAssign/types';
import {EventStoreHelper} from '../../../../src/BulkProcessManager/processes/ConsultantAssignProcess/EventStoreHelper';
import {EventRepository} from '../../../../src/EventRepository';
import {AgencyClientCommandBusFactory} from '../../../../src/factories/AgencyClientCommandBusFactory';
import {ConsultantJobAssignCommandBusFactory} from '../../../../src/factories/ConsultantJobAssignCommandBusFactory';
import {ConsultantJobCommandBusFactory} from '../../../../src/factories/ConsultantJobCommandBusFactory';

describe('EventStoreHelper', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';
  let eventStoreHelper: EventStoreHelper;
  let consultantJobAssignCommandBus: StubbedInstance<ConsultantJobAssignCommandBus>;
  let agencyClientCommandBus: StubbedInstance<AgencyClientCommandBus>;
  let consultantJobCommandBus: StubbedInstance<ConsultantJobCommandBus>;

  beforeEach(() => {
    const eventRepository = stubInterface<EventRepository>();

    consultantJobAssignCommandBus = stubInterface<ConsultantJobAssignCommandBus>();
    agencyClientCommandBus = stubInterface<AgencyClientCommandBus>();
    consultantJobCommandBus = stubInterface<ConsultantJobCommandBus>();
    sinon.stub(ConsultantJobAssignCommandBusFactory, 'getCommandBus').returns(consultantJobAssignCommandBus);
    sinon.stub(AgencyClientCommandBusFactory, 'getCommandBus').returns(agencyClientCommandBus);
    sinon.stub(ConsultantJobCommandBusFactory, 'getCommandBus').returns(consultantJobCommandBus);
    eventStoreHelper = new EventStoreHelper(agencyId, jobId, eventRepository);
    consultantJobAssignCommandBus.execute.resolves();
    consultantJobCommandBus.execute.resolves();
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('startProcess()', () => {
    it('Test executed command', async () => {
      await eventStoreHelper.startProcess();
      consultantJobAssignCommandBus.execute.should.have.been.calledWith(agencyId, jobId, {
        type: ConsultantJobAssignCommandEnum.START,
        data: {}
      });
    });
  });
  describe('succeedItemProcess()', () => {
    it('Test executed command', async () => {
      const clientId = 'A';

      await eventStoreHelper.succeedItemProcess(clientId);
      consultantJobAssignCommandBus.execute.should.have.been.calledWith(agencyId, jobId, {
        type: ConsultantJobAssignCommandEnum.SUCCEED_ITEM,
        data: {
          client_id: clientId
        }
      });
    });
  });
  describe('completeProcess()', () => {
    it('Test executed command', async () => {
      await eventStoreHelper.completeProcess();
      consultantJobAssignCommandBus.execute.should.have.been.calledWith(agencyId, jobId, {
        type: ConsultantJobAssignCommandEnum.COMPLETE,
        data: {}
      });
    });
  });
  describe('failItemProcess()', () => {
    it('Test executed command', async () => {
      const clientId = 'A';
      const errors: any = [{code: 'sample'}];

      await eventStoreHelper.failItemProcess(clientId, errors);
      consultantJobAssignCommandBus.execute.should.have.been.calledWith(agencyId, jobId, {
        type: ConsultantJobAssignCommandEnum.FAIL_ITEM,
        data: {
          client_id: clientId,
          errors
        }
      });
    });
  });
  describe('assignConsultantToClient()', () => {
    it('Test executed command', async () => {
      const consultantRoleId = 'A';
      const consultantId = 'B';
      const clientId = 'client id';
      const id = 'some id';

      sinon.stub(ObjectID.prototype, 'toString').returns(id);
      await eventStoreHelper.assignConsultantToClient(consultantRoleId, consultantId, clientId);
      agencyClientCommandBus.execute.should.have.been.calledWith(agencyId, clientId, {
        type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
        data: {
          _id: id,
          consultant_role_id: consultantRoleId,
          consultant_id: consultantId
        }
      });
    });
  });
  describe('getConsultantJobAssignAggregate()', () => {
    it('Test calling getAggregate', async () => {
      const aggregate: any = {ok: 'ok'};
      const getAggregate = sinon.stub(ConsultantJobAssignRepository.prototype, 'getAggregate').resolves(aggregate);
      const result = await eventStoreHelper.getConsultantJobAssignAggregate(agencyId, jobId);

      result.should.equal(aggregate);
      getAggregate.should.have.been.calledWith(agencyId, jobId);
    });
  });

  describe('completeConsultantJob()', () => {
    it('Test execute command', async () => {
      await eventStoreHelper.completeConsultantJob(agencyId, jobId);
      consultantJobCommandBus.execute.should.have.been.calledWith(agencyId, {
        data: {_id: jobId},
        type: ConsultantJobCommandEnum.COMPLETE_ASSIGN_CONSULTANT
      });
    });
  });
});
