export interface EventStoreEncodedErrorInterface {
  code: string;
  message: string;
  status?: number;
  original_error?: EventStoreEncodedErrorInterface;
  errors?: [
    {
      code: string;
      message: string;
      path: string[];
    }
  ];
}
