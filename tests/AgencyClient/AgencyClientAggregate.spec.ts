import {stubConstructor} from 'ts-sinon';
import {AgencyRepository} from '../../src/Agency/AgencyRepository';
import {AgencyClientAggregate} from '../../src/AgencyClient/AgencyClientAggregate';
import {ResourceNotFoundError} from 'a24-node-error-utils';

describe('AgencyClientAggregate class', () => {
  describe('validateRemoveClientConsultant()', () => {
    const agencyId = '61545c00ffac10f107000001';
    const clientId = '61545c08d6ad15d928000001';
    const consultantId = '61545cc5dee2458023000001';

    it('Test success scenario', async () => {
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = new AgencyClientAggregate(
        {
          agency_id: agencyId,
          client_id: clientId
        },
        {
          last_sequence_id: 100,
          linked: true,
          client_type: 'ward',
          consultants: [
            {
              _id: consultantId
            }
          ]
        },
        agencyRepository
      );

      await aggregate.validateRemoveClientConsultant({
        _id: consultantId
      });
    });

    it('Test failure scenario', async () => {
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = new AgencyClientAggregate(
        {
          agency_id: agencyId,
          client_id: clientId
        },
        {
          last_sequence_id: 100,
          linked: true,
          client_type: 'ward',
          consultants: [
            {
              _id: 'some-id'
            }
          ]
        },
        agencyRepository
      );

      await aggregate
        .validateRemoveClientConsultant({
          _id: consultantId
        })
        .should.to.be.rejectedWith(ResourceNotFoundError);
    });
  });
});
