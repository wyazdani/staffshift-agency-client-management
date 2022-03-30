export interface EventStoreEncodedErrorInterface {
  code: string;
  message: string;
  status?: number;
  originalError?: EventStoreEncodedErrorInterface;
  errors?: [
    {
      code: string;
      message: string;
      path: string[];
    }
  ];
}
