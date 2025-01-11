import { NEXT_PUBLIC_PONDER_URL } from '../config';
import { GraphQLClient, type RequestDocument } from 'graphql-request';

const client = new GraphQLClient(NEXT_PUBLIC_PONDER_URL);

export const ponderRequest = async <T = any>(
  query: RequestDocument,
  variables?: { [key: string]: any },
  forceResultIfFail?: any,
): Promise<T> => {
  try {
    return await client.request<T>(query, variables);
  } catch (error) {
    console.error('Error realizando la solicitud GraphQL:', error);
    if (forceResultIfFail) {
      return forceResultIfFail;
    }
    throw error;
  }
};
