import {stubConstructor} from 'ts-sinon';
import {ConsultantNameChangeProcessor} from '../../src/domain-events-processors/ConsultantNameChangeProcessor';
import {FacadeClientHelper} from '../../src/helpers/FacadeClientHelper';
import sinon from 'sinon';
import {AgencyClientConsultantsProjectionV3} from '../../src/models/AgencyClientConsultantsProjectionV3';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';

describe('ConsultantNameChangeProcessor', () => {
  describe('process()', () => {
    it('Test success scenario', async () => {
      const updateManyV3 = sinon.stub(AgencyClientConsultantsProjectionV3, 'updateMany').resolves();
      const userId = 'user id';
      const fullName = 'AA BB';
      const facadeClientHelper = stubConstructor(FacadeClientHelper);

      facadeClientHelper.getUserFullName.resolves(fullName);
      const processor = new ConsultantNameChangeProcessor(TestUtilsLogger.getLogger(sinon.spy()), facadeClientHelper);

      await processor.process({user_id: userId});

      updateManyV3.should.have.been.calledWith(
        {
          consultant_id: userId
        },
        {
          $set: {
            consultant_name: fullName
          }
        }
      );
      facadeClientHelper.getUserFullName.should.have.been.calledWith(userId);
    });
    it('Test failure scenario', async () => {
      const updateMany = sinon.stub(AgencyClientConsultantsProjectionV3, 'updateMany');
      const userId = 'user id';
      const facadeClientHelper = stubConstructor(FacadeClientHelper);
      const error = new Error('some error');

      facadeClientHelper.getUserFullName.rejects(error);
      const processor = new ConsultantNameChangeProcessor(TestUtilsLogger.getLogger(sinon.spy()), facadeClientHelper);

      await processor.process({user_id: userId}).should.have.been.rejectedWith(Error, 'some error');
      updateMany.should.not.have.been.called;
      facadeClientHelper.getUserFullName.should.have.been.calledWith(userId);
    });
  });
});
