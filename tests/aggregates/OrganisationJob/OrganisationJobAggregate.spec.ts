import {assert} from 'chai';
import {stubInterface} from 'ts-sinon';
import {OrganisationJobRepository} from '../../../src/aggregates/OrganisationJob/OrganisationJobRepository';
import {AbstractAggregate} from '../../../src/aggregates/AbstractAggregate';
import {OrganisationJobAggregate} from '../../../src/aggregates/OrganisationJob/OrganisationJobAggregate';
import {ResourceNotFoundError, ValidationError} from 'a24-node-error-utils';
import {OrganisationJobAggregateIdInterface} from '../../../src/aggregates/OrganisationJob/types';
import {
  CompleteApplyPaymentTermCommandDataInterface,
  CompleteInheritPaymentTermCommandDataInterface,
  InitiateApplyPaymentTermCommandDataInterface,
  InitiateInheritPaymentTermCommandDataInterface
} from '../../../src/aggregates/OrganisationJob/types/CommandTypes';

describe('OrganisationJobAggregate', () => {
  const aggregateId: OrganisationJobAggregateIdInterface = {
    name: 'organisation_job',
    agency_id: 'agency id',
    organisation_id: 'organisation id'
  };

  it('Test inheritance of AbstractAggregate', () => {
    const aggregate = {
      payment_term_jobs: {
        'job id': 'completed'
      },
      last_sequence_id: 1
    };
    const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

    organisationJobAggregate.should.be.instanceof(AbstractAggregate);
  });
  describe('validateInitiatedApplyPaymentTerm', () => {
    const command: InitiateApplyPaymentTermCommandDataInterface = {
      _id: 'job id',
      term: 'credit',
      client_id: 'client_id'
    };

    it('Test another job process active error', async () => {
      const aggregate = {
        payment_term_jobs: {
          'job id': 'started'
        },
        last_sequence_id: 1
      };
      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      const error = await organisationJobAggregate
        .validateInitiateApplyPaymentTerm(command)
        .should.be.rejectedWith(ValidationError);

      error.assertEqual(
        new ValidationError('Another job active').setErrors([
          {
            code: 'ANOTHER_JOB_PROCESS_ACTIVE',
            message: `Can't create job id ${command._id}, as there is another job in progress`
          }
        ])
      );
    });

    it('Test success scenario', async () => {
      const aggregate = {
        payment_term_jobs: {
          'job id': 'completed'
        },
        last_sequence_id: 1
      };
      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      await organisationJobAggregate.validateInitiateApplyPaymentTerm(command);
    });
  });

  describe('validateInitiatedInheritPaymentTerm', () => {
    const command: InitiateInheritPaymentTermCommandDataInterface = {
      _id: 'job id',
      client_id: 'client_id'
    };

    it('Test another job process active error', async () => {
      const aggregate = {
        payment_term_jobs: {
          'job id': 'started'
        },
        last_sequence_id: 1
      };
      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      const error = await organisationJobAggregate
        .validateInitiateInheritPaymentTerm(command)
        .should.be.rejectedWith(ValidationError);

      error.assertEqual(
        new ValidationError('Another job active').setErrors([
          {
            code: 'ANOTHER_JOB_PROCESS_ACTIVE',
            message: `Can't create job id ${command._id}, as there is another job in progress`
          }
        ])
      );
    });

    it('Test success scenario', async () => {
      const aggregate = {
        payment_term_jobs: {
          'job id': 'completed'
        },
        last_sequence_id: 1
      };
      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      await organisationJobAggregate.validateInitiateInheritPaymentTerm(command);
    });
  });

  describe('validateCompleteInheritPaymentTerm', () => {
    const command: CompleteInheritPaymentTermCommandDataInterface = {
      _id: 'job id'
    };

    it('Test Resource Not Found error', async () => {
      const aggregate = {
        last_sequence_id: 1
      };

      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      await organisationJobAggregate
        .validateCompleteInheritPaymentTerm(command)
        .should.be.rejectedWith(ResourceNotFoundError, `Job ${command._id} is not found`);
    });

    it('Test Job is already completed error', async () => {
      const aggregate = {
        payment_term_jobs: {
          'job id': 'completed'
        },
        last_sequence_id: 1
      };

      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      const error = await organisationJobAggregate
        .validateCompleteInheritPaymentTerm(command)
        .should.be.rejectedWith(ValidationError);

      error.assertEqual(
        new ValidationError('Job is already completed').setErrors([
          {
            code: 'JOB_ALREADY_COMPLETED',
            message: `Job ${command._id} has already been completed`,
            path: ['_id']
          }
        ])
      );
    });

    it('Test started error', async () => {
      const aggregate = {
        payment_term_jobs: {
          'job id': 'started'
        },
        last_sequence_id: 1
      };

      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      await organisationJobAggregate
        .validateCompleteInheritPaymentTerm(command)
        .should.be.rejectedWith(ResourceNotFoundError, `Job ${command._id} is not found`);
    });

    it('Test success sceanrio', async () => {
      const aggregate = {
        payment_term_jobs: {
          'job id': 'started_inherited'
        },
        last_sequence_id: 1
      };

      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      await organisationJobAggregate.validateCompleteInheritPaymentTerm(command);
    });
  });

  describe('validateCompleteApplyPaymentTerm', () => {
    const command: CompleteApplyPaymentTermCommandDataInterface = {
      _id: 'job id'
    };

    it('Test Job Not Found error', async () => {
      const aggregate = {
        last_sequence_id: 1
      };

      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      await organisationJobAggregate
        .validateCompleteApplyPaymentTerm(command)
        .should.be.rejectedWith(ResourceNotFoundError, `Job ${command._id} is not found`);
    });

    it('Test Job is already completed error', async () => {
      const aggregate = {
        payment_term_jobs: {
          'job id': 'completed'
        },
        last_sequence_id: 1
      };

      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      const error = await organisationJobAggregate
        .validateCompleteApplyPaymentTerm(command)
        .should.be.rejectedWith(ValidationError);

      error.assertEqual(
        new ValidationError('Job is already completed').setErrors([
          {
            code: 'JOB_ALREADY_COMPLETED',
            message: `Job ${command._id} has already been completed`,
            path: ['_id']
          }
        ])
      );
    });

    it('Test started_inherited error', async () => {
      const aggregate = {
        payment_term_jobs: {
          'job id': 'started_inherited'
        },
        last_sequence_id: 1
      };

      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      await organisationJobAggregate
        .validateCompleteApplyPaymentTerm(command)
        .should.be.rejectedWith(ResourceNotFoundError, `Job ${command._id} is not found`);
    });

    it('Test success scenario', async () => {
      const aggregate = {
        payment_term_jobs: {
          'job id': 'started'
        },
        last_sequence_id: 1
      };

      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      await organisationJobAggregate.validateCompleteApplyPaymentTerm(command);
    });
  });
});
