import {FinancialHoldCommandInterface} from './FinancialHoldCommandInterface';

export interface FinancialHoldCommandHandlerInterface {
  commandType: string;
  execute(command: FinancialHoldCommandInterface): Promise<number>;
}
