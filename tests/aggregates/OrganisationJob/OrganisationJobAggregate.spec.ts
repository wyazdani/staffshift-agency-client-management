import {assert} from 'chai';
import {stubInterface} from 'ts-sinon';
import {OrganisationJobRepository} from '../../../src/aggregates/OrganisationJob/OrganisationJobRepository';
import {AbstractAggregate} from '../../../src/aggregates/AbstractAggregate';
import {OrganisationJobAggregate} from '../../../src/aggregates/OrganisationJob/OrganisationJobAggregate';
import {ValidationError} from 'a24-node-error-utils';
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
      running_apply_payment_term: [
        {
          job_id: 'job id'
        }
      ],
      payment_terms: {
        'job id': 'completed'
      }
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

    it('Test Job Not started error', async () => {
      const aggregate = {
        running_apply_payment_term: [
          {
            job_id: 'job id'
          }
        ],
        payment_terms: {
          'job id': ''
        }
      };
      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      const error = await organisationJobAggregate
        .validateInitiateApplyPaymentTerm(command)
        .should.be.rejectedWith(ValidationError);

      error.assertEqual(
        new ValidationError('Job Not Started').setErrors([
          {
            code: 'JOB_NOT_STARTED',
            message: `Job ${command._id} not started yet`,
            path: ['job id']
          }
        ])
      );
    });

    it('Test another job process active error', async () => {
      const aggregate = {
        running_apply_payment_term: [
          {
            job_id: 'id'
          }
        ],
        payment_terms: {
          'job id': 'started'
        }
      };
      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      const error = await organisationJobAggregate
        .validateInitiateApplyPaymentTerm(command)
        .should.be.rejectedWith(ValidationError);

      error.assertEqual(
        new ValidationError('Not allowed job id').setErrors([
          {
            code: 'ANOTHER_JOB_PROCESS_ACTIVE',
            message: `There is another job still running for this job id ${command._id}`,
            path: ['job id']
          }
        ])
      );
    });
  });

  describe('validateInitiatedInheritPaymentTerm', () => {
    const command: InitiateInheritPaymentTermCommandDataInterface = {
      _id: 'job id',
      client_id: 'client_id'
    };

    it('Test Job Not Started error', async () => {
      const aggregate = {
        running_apply_payment_term_inheritance: [
          {
            job_id: 'job id'
          }
        ],
        payment_terms: {
          'job id': ''
        }
      };

      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      const error = await organisationJobAggregate
        .validateInitiateInheritPaymentTerm(command)
        .should.be.rejectedWith(ValidationError);

      error.assertEqual(
        new ValidationError('Job Not Started').setErrors([
          {
            code: 'JOB_NOT_STARTED',
            message: `Job ${command._id} not started yet`,
            path: ['job id']
          }
        ])
      );
    });

    it('Test another job process active error', async () => {
      const aggregate = {
        running_apply_payment_term_inheritance: [
          {
            job_id: 'id'
          }
        ],
        payment_terms: {
          'job id': 'started'
        }
      };
      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      const error = await organisationJobAggregate
        .validateInitiateInheritPaymentTerm(command)
        .should.be.rejectedWith(ValidationError);

      error.assertEqual(
        new ValidationError('Not allowed job id').setErrors([
          {
            code: 'ANOTHER_JOB_PROCESS_ACTIVE',
            message: `There is another job still running for this job id ${command._id}`,
            path: ['job id']
          }
        ])
      );
    });
  });

  describe('validateCompleteInheritPaymentTerm', () => {
    const command: CompleteInheritPaymentTermCommandDataInterface = {
      _id: 'job id'
    };

    it('Test Job Not Completed error', async () => {
      const aggregate = {
        running_apply_payment_term_inheritance: [
          {
            job_id: 'job id'
          }
        ],
        payment_terms: {
          'job id': 'started'
        }
      };

      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      const error = await organisationJobAggregate
        .validateCompleteInheritPaymentTerm(command)
        .should.be.rejectedWith(ValidationError);

      error.assertEqual(
        new ValidationError('Job Not Completed').setErrors([
          {
            code: 'JOB_NOT_COMPLETED',
            message: `Job ${command._id} is still running`,
            path: ['job id']
          }
        ])
      );
    });

    it('Test another job process active error', async () => {
      const aggregate = {
        running_apply_payment_term_inheritance: [
          {
            job_id: 'id'
          }
        ],
        payment_terms: {
          'job id': 'completed'
        }
      };
      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      const error = await organisationJobAggregate
        .validateCompleteInheritPaymentTerm(command)
        .should.be.rejectedWith(ValidationError);

      error.assertEqual(
        new ValidationError('Not allowed job id').setErrors([
          {
            code: 'ANOTHER_JOB_PROCESS_ACTIVE',
            message: `There is another job still running for this job id ${command._id}`,
            path: ['job id']
          }
        ])
      );
    });
  });

  describe('validateCompleteApplyPaymentTerm', () => {
    const command: CompleteApplyPaymentTermCommandDataInterface = {
      _id: 'job id'
    };

    it('Test Job Not Completed error', async () => {
      const aggregate = {
        running_apply_payment_term: [
          {
            job_id: 'job id'
          }
        ],
        payment_terms: {
          'job id': 'started'
        }
      };

      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      const error = await organisationJobAggregate
        .validateCompleteApplyPaymentTerm(command)
        .should.be.rejectedWith(ValidationError);

      error.assertEqual(
        new ValidationError('Job Not Completed').setErrors([
          {
            code: 'JOB_NOT_COMPLETED',
            message: `Job ${command._id} is still running`,
            path: ['job id']
          }
        ])
      );
    });

    it('Test another job process active error', async () => {
      const aggregate = {
        running_apply_payment_term: [
          {
            job_id: 'id'
          }
        ],
        payment_terms: {
          'job id': 'completed'
        }
      };
      const organisationJobAggregate = new OrganisationJobAggregate(aggregateId, aggregate);

      const error = await organisationJobAggregate
        .validateCompleteApplyPaymentTerm(command)
        .should.be.rejectedWith(ValidationError);

      error.assertEqual(
        new ValidationError('Not allowed job id').setErrors([
          {
            code: 'ANOTHER_JOB_PROCESS_ACTIVE',
            message: `There is another job still running for this job id ${command._id}`,
            path: ['job id']
          }
        ])
      );
    });
  });
});
