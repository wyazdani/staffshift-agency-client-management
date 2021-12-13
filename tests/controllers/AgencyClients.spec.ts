import sinon from 'sinon';
import {GenericRepository} from '../../src/GenericRepository';
import {getAgencyClient} from '../../src/controllers/AgencyClients';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';

describe('AgencyClients', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getAgencyClient()', function () {
    it('should return agency client on success', async function () {
      const agencyId = 'agency id';
      const clientId = '61a63e6eb34a527a852d6874';
      const params = {
        agency_id: {value: agencyId},
        client_id: {value: clientId}
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');
      const setHeader = sinon.stub(res, 'setHeader');
      const record: any = {
        _id: clientId,
        agency_id: agencyId,
        client_id: clientId,
        linked: true
      };
      const findOne = sinon.stub(GenericRepository.prototype, 'findOne').resolves(record);

      await getAgencyClient(req, res, next);
      findOne.should.have.been.calledWith({
        client_id: clientId,
        agency_id: agencyId
      });
      setHeader.should.have.been.calledWith('Content-Type', 'application/json');
      end.should.have.been.calledWith(JSON.stringify(record));
    });
  });
});
