export interface EventHandlerInterface {
  handle(event: any): Promise<void>;
}
