export interface EventStoreEncodedErrorInterface {
  code: string;
  message: string;
  status?: number;
  originalError?: EventStoreEncodedErrorInterface;
  results?: [
    {
      code: string;
      message: string;
      path: string[];
    }
  ];
}
