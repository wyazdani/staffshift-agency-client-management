import {ObjectID} from 'mongodb';
import sinon, {stubInterface, StubbedInstance} from 'ts-sinon';
import {AgencyClientCommandBus} from '../../../../src/aggregates/AgencyClient/AgencyClientCommandBus';
import {AgencyClientCommandEnum} from '../../../../src/aggregates/AgencyClient/types';
import {ConsultantJobAssignCommandBus} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignCommandBus';
import {ConsultantJobAssignCommandEnum} from '../../../../src/aggregates/ConsultantJobAssign/types';
import {ConsultantJobAssignErrorItemEnum} from '../../../../src/aggregates/ConsultantJobAssign/types/ConsultantJobAssignErrorItemEnum';
import {EventStoreHelper} from '../../../../src/BulkProcessManager/processes/ConsultantAssignProcess/EventStoreHelper';
import {EventRepository} from '../../../../src/EventRepository';
import {AgencyClientCommandBusFactory} from '../../../../src/factories/AgencyClientCommandBusFactory';
import {ConsultantJobAssignCommandBusFactory} from '../../../../src/factories/ConsultantJobAssignCommandBusFactory';

describe('EventStoreHelper', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';
  let eventStoreHelper: EventStoreHelper;
  let consultantJobAssignCommandBus: StubbedInstance<ConsultantJobAssignCommandBus>;
  let agencyClientCommandBus: StubbedInstance<AgencyClientCommandBus>;

  beforeEach(() => {
    const eventRepository = stubInterface<EventRepository>();

    consultantJobAssignCommandBus = stubInterface<ConsultantJobAssignCommandBus>();
    agencyClientCommandBus = stubInterface<AgencyClientCommandBus>();
    sinon.stub(ConsultantJobAssignCommandBusFactory, 'getCommandBus').returns(consultantJobAssignCommandBus);
    sinon.stub(AgencyClientCommandBusFactory, 'getCommandBus').returns(agencyClientCommandBus);
    eventStoreHelper = new EventStoreHelper(agencyId, jobId, eventRepository);
    consultantJobAssignCommandBus.execute.resolves();
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
  describe('progressProcess()', () => {
    it('Test executed command', async () => {
      const clientIds = ['A', 'B'];

      await eventStoreHelper.progressProcess(clientIds);
      consultantJobAssignCommandBus.execute.should.have.been.calledWith(agencyId, jobId, {
        type: ConsultantJobAssignCommandEnum.PROGRESS,
        data: {
          count: 2,
          client_ids: clientIds
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

      await eventStoreHelper.failItemProcess(clientId, ConsultantJobAssignErrorItemEnum.VALIDATION_ERROR, 'sample');
      consultantJobAssignCommandBus.execute.should.have.been.calledWith(agencyId, jobId, {
        type: ConsultantJobAssignCommandEnum.FAIL_ITEM,
        data: {
          client_id: clientId,
          error_code: ConsultantJobAssignErrorItemEnum.VALIDATION_ERROR,
          error_message: 'sample'
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
});
