// import { PONDER_URL } from '../config';
import { GraphQLClient, type RequestDocument } from 'graphql-request';
import { PONDER_URL, SERVER_URL } from '../config';

const ponderClient = new GraphQLClient(PONDER_URL);
const serverClient = new GraphQLClient(SERVER_URL);

export const ponderRequest = async <T = any>(
  query: RequestDocument,
  variables?: { [key: string]: any },
  forceResultIfFail?: any,
): Promise<T> => {
  try {
    return await ponderClient.request<T>(query, variables);
  } catch (error) {
    console.error('Error realizando la solicitud GraphQL:', error);
    if (forceResultIfFail) {
      return forceResultIfFail;
    }
    throw error;
  }
};

export const serverRequest = async <T = any>(
  query: RequestDocument,
  variables?: { [key: string]: any },
  headers?: { [key: string]: string },
  forceResultIfFail?: any,
): Promise<T> => {
  try {
    return await serverClient.request<T>(query, variables, headers);
  } catch (error) {
    console.error('Error realizando la solicitud GraphQL:', error);
    if (forceResultIfFail) {
      return forceResultIfFail;
    }
    throw error;
  }
};
