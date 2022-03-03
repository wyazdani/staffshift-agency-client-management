import {Document, Schema, model} from 'mongoose';
import {AggregateIdType} from './EventStore';

export enum BulkProcessManagerStatusEnum {
  NEW = 'new',
  PROCESSING = 'processing',
  COMPLETED = 'completed'
}
export type BulkProcessManagerV1DocumentType = Document & {
  _id: string;
  aggregate_id: AggregateIdType;
  status: BulkProcessManagerStatusEnum;
  total_items?: number;
  processed_items?: number;
  created_at: Date;
  updated_at: Date;
  __v: number;
};

const bulkProcessManager = new Schema<BulkProcessManagerV1DocumentType>(
  {
    _id: {
      type: String,
      required: true,
      description: 'unique identifier'
    },
    aggregate_id: {
      type: Object,
      required: true,
      description: 'Uniquely identifies the aggregate'
    },
    status: {
      type: String,
      required: true,
      enum: [
        BulkProcessManagerStatusEnum.NEW,
        BulkProcessManagerStatusEnum.PROCESSING,
        BulkProcessManagerStatusEnum.COMPLETED
      ],
      description: 'Status of process'
    },
    total_items: {
      type: Number,
      required: false,
      description: 'Total items to that needs to be processed'
    },
    processed_items: {
      type: Number,
      required: false,
      description: 'Number of items have been processed so far'
    },
    initiate_event_id: {
      type: String,
      required: true,
      description: 'Event id of initiate. We use this field to find causation id'
    }
  },
  {
    optimisticConcurrency: true,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'BulkProcessManagerV1'
  }
);

export const BulkProcessManagerV1 = model<BulkProcessManagerV1DocumentType>('BulkProcessManagerV1', bulkProcessManager);
