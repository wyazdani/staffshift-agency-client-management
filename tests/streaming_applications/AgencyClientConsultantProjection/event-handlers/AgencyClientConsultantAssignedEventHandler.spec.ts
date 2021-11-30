import sinon, {stubConstructor} from 'ts-sinon';
import {assert} from 'chai';
import {AgencyRepository} from '../../../../src/Agency/AgencyRepository';
import {FacadeClientHelper} from '../../../../src/helpers/FacadeClientHelper';
import {AgencyClientConsultantAssignedEventHandler} from '../../../../src/streaming_applications/AgencyClientConsultantProjection/event-handlers/AgencyClientConsultantAssignedEventHandler';
import {AgencyAggregate} from '../../../../src/Agency/AgencyAggregate';
import {AgencyConsultantRoleEnum} from '../../../../src/Agency/types';
import {AgencyClientConsultantsProjection} from '../../../../src/models/AgencyClientConsultantsProjection';
import {EventsEnum} from '../../../../src/Events';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';

describe('AgencyClientConsultantAssignedEventHandler', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('handle()', () => {
    const agencyId = '5b16b824e8a73a752c42d848';
    const clientId = '6155c39a2dff5a83f7b7bc6c';
    const event: any = {
      type: EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
      sequence_id: 1,
      aggregate_id: {
        agency_id: agencyId,
        client_id: clientId
      },
      data: {
        _id: '6155dbf647852e2b3852ef29',
        consultant_role_id: '456',
        consultant_id: '789'
      }
    };
    const consultantRole = {
      _id: '2020',
      name: 'ooh',
      description: 'blah',
      max_consultants: 1,
      status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED
    };

    it('should create agency client consultant record', async () => {
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyAggregateStub = stubConstructor(AgencyAggregate);
      const facadeClientHelperStub = stubConstructor(FacadeClientHelper);
      const handler = new AgencyClientConsultantAssignedEventHandler(
        TestUtilsLogger.getLogger(sinon.spy()),
        agencyRepositoryStub,
        facadeClientHelperStub
      );
      const expectedClientConsultantRecord = {
        _id: event.data._id,
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id,
        consultant_role_id: event.data.consultant_role_id,
        consultant_role_name: consultantRole.name,
        consultant_id: event.data.consultant_id,
        consultant_name: 'AAA'
      };
      const saveStub = sinon.stub(AgencyClientConsultantsProjection.prototype, 'save');

      saveStub.callsFake(() => {
        const data = saveStub.thisValues[0];

        assert.deepEqual(
          data.toJSON(),
          expectedClientConsultantRecord,
          'Incorrect agency client consultant record saved'
        );
        return Promise.resolve();
      });

      agencyRepositoryStub.getAggregate.resolves(agencyAggregateStub);
      agencyAggregateStub.getConsultantRole.returns(consultantRole);
      facadeClientHelperStub.getUserFullName.resolves('AAA');

      await handler.handle(event);
      assert.equal(saveStub.callCount, 1, 'save should be called once');
      facadeClientHelperStub.getUserFullName.should.have.been.calledWith(event.data.consultant_id);
    });

    it('should resolve successfully when a duplicate key error is thrown on save', async () => {
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyAggregateStub = stubConstructor(AgencyAggregate);
      const facadeClientHelperStub = stubConstructor(FacadeClientHelper);
      const handler = new AgencyClientConsultantAssignedEventHandler(
        TestUtilsLogger.getLogger(sinon.spy()),
        agencyRepositoryStub,
        facadeClientHelperStub
      );
      const expectedClientConsultantRecord = {
        _id: event.data._id,
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id,
        consultant_role_id: event.data.consultant_role_id,
        consultant_role_name: consultantRole.name,
        consultant_id: event.data.consultant_id,
        consultant_name: 'AAA'
      };
      const saveStub = sinon.stub(AgencyClientConsultantsProjection.prototype, 'save');

      saveStub.callsFake(() => {
        const data = saveStub.thisValues[0];

        assert.deepEqual(
          data.toJSON(),
          expectedClientConsultantRecord,
          'Incorrect agency client consultant record saved'
        );
        return Promise.reject({code: MONGO_ERROR_CODES.DUPLICATE_KEY});
      });

      agencyRepositoryStub.getAggregate.resolves(agencyAggregateStub);
      agencyAggregateStub.getConsultantRole.returns(consultantRole);
      facadeClientHelperStub.getUserFullName.resolves('AAA');

      await handler.handle(event);
      assert.equal(saveStub.callCount, 1, 'save should be called once');
      facadeClientHelperStub.getUserFullName.should.have.been.calledWith(event.data.consultant_id);
    });

    it('should create agency client consultant record when user full name not found', async () => {
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyAggregateStub = stubConstructor(AgencyAggregate);
      const facadeClientHelperStub = stubConstructor(FacadeClientHelper);
      const handler = new AgencyClientConsultantAssignedEventHandler(
        TestUtilsLogger.getLogger(sinon.spy()),
        agencyRepositoryStub,
        facadeClientHelperStub
      );
      const expectedClientConsultantRecord = {
        _id: event.data._id,
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id,
        consultant_role_id: event.data.consultant_role_id,
        consultant_role_name: consultantRole.name,
        consultant_id: event.data.consultant_id,
        consultant_name: 'Unknown Unknown'
      };
      const saveStub = sinon.stub(AgencyClientConsultantsProjection.prototype, 'save');

      saveStub.callsFake(() => {
        const data = saveStub.thisValues[0];

        assert.deepEqual(
          data.toJSON(),
          expectedClientConsultantRecord,
          'Incorrect agency client consultant record saved'
        );
        return Promise.resolve();
      });

      agencyRepositoryStub.getAggregate.resolves(agencyAggregateStub);
      agencyAggregateStub.getConsultantRole.returns(consultantRole);
      facadeClientHelperStub.getUserFullName.rejects(new ResourceNotFoundError('oops'));

      await handler.handle(event);
      assert.equal(saveStub.callCount, 1, 'save should be called once');
      facadeClientHelperStub.getUserFullName.should.have.been.calledWith(event.data.consultant_id);
    });

    it('should throw an error if the getAggregate call fails', async () => {
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const facadeClientHelperStub = stubConstructor(FacadeClientHelper);
      const handler = new AgencyClientConsultantAssignedEventHandler(
        TestUtilsLogger.getLogger(sinon.spy()),
        agencyRepositoryStub,
        facadeClientHelperStub
      );
      const expectedClientConsultantRecord = {
        _id: event.data._id,
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id,
        consultant_role_id: event.data.consultant_role_id,
        consultant_role_name: consultantRole.name,
        consultant_id: event.data.consultant_id,
        last_sequence_id: 3
      };
      const saveStub = sinon.stub(AgencyClientConsultantsProjection.prototype, 'save');

      saveStub.callsFake(() => {
        const data = saveStub.thisValues[0];

        assert.deepEqual(
          data.toJSON(),
          expectedClientConsultantRecord,
          'Incorrect agency client consultant record saved'
        );
        return Promise.resolve();
      });

      agencyRepositoryStub.getAggregate.rejects(new Error('meh error'));

      await handler.handle(event).should.be.rejectedWith(Error, 'meh error');
      assert.equal(saveStub.callCount, 0, 'save should have not been called');
    });

    it('should throw error when the call to save the record fails', async () => {
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyAggregateStub = stubConstructor(AgencyAggregate);
      const facadeClientHelperStub = stubConstructor(FacadeClientHelper);
      const handler = new AgencyClientConsultantAssignedEventHandler(
        TestUtilsLogger.getLogger(sinon.spy()),
        agencyRepositoryStub,
        facadeClientHelperStub
      );
      const expectedClientConsultantRecord = {
        _id: event.data._id,
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id,
        consultant_role_id: event.data.consultant_role_id,
        consultant_role_name: consultantRole.name,
        consultant_id: event.data.consultant_id
      };
      const saveStub = sinon.stub(AgencyClientConsultantsProjection.prototype, 'save');

      saveStub.callsFake(() => {
        const data = saveStub.thisValues[0];

        assert.deepEqual(
          data.toJSON(),
          expectedClientConsultantRecord,
          'Incorrect agency client consultant record saved'
        );
        return Promise.reject(new Error('weird error'));
      });

      agencyRepositoryStub.getAggregate.resolves(agencyAggregateStub);
      agencyAggregateStub.getConsultantRole.returns(consultantRole);

      await handler.handle(event).should.be.rejectedWith(Error, 'weird error');
      assert.equal(saveStub.callCount, 1, 'save should be called once');
    });
  });
});
