/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type Meta = {
  __typename?: 'Meta';
  status?: Maybe<Scalars['JSON']['output']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  _meta?: Maybe<Meta>;
  staker?: Maybe<Staker>;
  stakers: StakerPage;
};


export type QueryStakerArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
};


export type QueryStakersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<StakerFilter>;
};

export type Staker = {
  __typename?: 'Staker';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  lastUpdate: Scalars['BigInt']['output'];
  shares: Scalars['BigInt']['output'];
  stakedAssets: Scalars['BigInt']['output'];
  unstakedAssets: Scalars['BigInt']['output'];
};

export type StakerFilter = {
  AND?: InputMaybe<Array<InputMaybe<StakerFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<StakerFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lastUpdate?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  lastUpdate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  shares?: InputMaybe<Scalars['BigInt']['input']>;
  shares_gt?: InputMaybe<Scalars['BigInt']['input']>;
  shares_gte?: InputMaybe<Scalars['BigInt']['input']>;
  shares_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  shares_lt?: InputMaybe<Scalars['BigInt']['input']>;
  shares_lte?: InputMaybe<Scalars['BigInt']['input']>;
  shares_not?: InputMaybe<Scalars['BigInt']['input']>;
  shares_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  stakedAssets?: InputMaybe<Scalars['BigInt']['input']>;
  stakedAssets_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedAssets_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedAssets_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  stakedAssets_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedAssets_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedAssets_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedAssets_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  unstakedAssets?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedAssets_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedAssets_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedAssets_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  unstakedAssets_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedAssets_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedAssets_not?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedAssets_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type StakerPage = {
  __typename?: 'StakerPage';
  items: Array<Staker>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GetStakersQueryVariables = Exact<{
  where?: InputMaybe<StakerFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetStakersQuery = { __typename?: 'Query', stakers: { __typename?: 'StakerPage', items: Array<{ __typename?: 'Staker', address: string, chainId: number, shares: any, stakedAssets: any, unstakedAssets: any, lastUpdate: any }>, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };


export const GetStakersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStakers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StakerFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stakers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"stakedAssets"}},{"kind":"Field","name":{"kind":"Name","value":"unstakedAssets"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetStakersQuery, GetStakersQueryVariables>;