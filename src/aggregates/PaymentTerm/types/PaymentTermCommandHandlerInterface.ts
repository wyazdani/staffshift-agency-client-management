import {PaymentTermCommandInterface} from './PaymentTermCommandInterface';

export interface PaymentTermCommandHandlerInterface {
  commandType: string;
  execute(command: PaymentTermCommandInterface): Promise<number>;
}
