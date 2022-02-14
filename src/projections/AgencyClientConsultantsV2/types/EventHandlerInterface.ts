export interface EventHandlerInterface<T> {
  handle(event: T): Promise<void>;
}
