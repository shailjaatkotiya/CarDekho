export type GraphQLResponse<T> = {
  data: T;
  errors?: { message: string }[];
};
