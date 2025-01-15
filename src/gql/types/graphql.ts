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
  Date: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  _Any: { input: any; output: any; }
  federation__FieldSet: { input: any; output: any; }
  link__Import: { input: any; output: any; }
};

export type Error = {
  __typename?: 'Error';
  code?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type GetSignedStakingRewardInput = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  stakerAddress?: InputMaybe<Scalars['String']['input']>;
};

export type GetSignedStakingRewardResult = Error | SignedStakingReward;

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
  _service: _Service;
  getSignedStakingReward?: Maybe<GetSignedStakingRewardResult>;
  staker?: Maybe<Staker>;
  stakers: StakerPage;
  stakingReward?: Maybe<StakingReward>;
  stakingRewardGlobal?: Maybe<StakingRewardGlobal>;
  stakingRewardGlobals: StakingRewardGlobalPage;
  stakingRewards: StakingRewardPage;
};


export type QueryGetSignedStakingRewardArgs = {
  input?: InputMaybe<GetSignedStakingRewardInput>;
};


export type QueryStakerArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
  staker: Scalars['String']['input'];
};


export type QueryStakersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<StakerFilter>;
};


export type QueryStakingRewardArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
  staker: Scalars['String']['input'];
};


export type QueryStakingRewardGlobalArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
};


export type QueryStakingRewardGlobalsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<StakingRewardGlobalFilter>;
};


export type QueryStakingRewardsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<StakingRewardFilter>;
};

export type SignedStakingReward = {
  __typename?: 'SignedStakingReward';
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['String']['output']>;
  asset?: Maybe<Scalars['String']['output']>;
  available?: Maybe<Scalars['String']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  claimed?: Maybe<Scalars['String']['output']>;
  lastUpdate?: Maybe<Scalars['String']['output']>;
  signature?: Maybe<Scalars['String']['output']>;
  signer?: Maybe<Scalars['String']['output']>;
  staker?: Maybe<Scalars['String']['output']>;
  vault?: Maybe<Scalars['String']['output']>;
};

export type Staker = {
  __typename?: 'Staker';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  computing: Scalars['BigInt']['output'];
  coolingDown: Scalars['BigInt']['output'];
  lastUpdate: Scalars['BigInt']['output'];
  releaseTime: Scalars['BigInt']['output'];
  shares: Scalars['BigInt']['output'];
  stakedAssets: Scalars['BigInt']['output'];
  staker: Scalars['String']['output'];
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
  computing?: InputMaybe<Scalars['BigInt']['input']>;
  computing_gt?: InputMaybe<Scalars['BigInt']['input']>;
  computing_gte?: InputMaybe<Scalars['BigInt']['input']>;
  computing_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  computing_lt?: InputMaybe<Scalars['BigInt']['input']>;
  computing_lte?: InputMaybe<Scalars['BigInt']['input']>;
  computing_not?: InputMaybe<Scalars['BigInt']['input']>;
  computing_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  coolingDown?: InputMaybe<Scalars['BigInt']['input']>;
  coolingDown_gt?: InputMaybe<Scalars['BigInt']['input']>;
  coolingDown_gte?: InputMaybe<Scalars['BigInt']['input']>;
  coolingDown_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  coolingDown_lt?: InputMaybe<Scalars['BigInt']['input']>;
  coolingDown_lte?: InputMaybe<Scalars['BigInt']['input']>;
  coolingDown_not?: InputMaybe<Scalars['BigInt']['input']>;
  coolingDown_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  lastUpdate?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  lastUpdate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  releaseTime?: InputMaybe<Scalars['BigInt']['input']>;
  releaseTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  releaseTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  releaseTime_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  releaseTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  releaseTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  releaseTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  releaseTime_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
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
  staker?: InputMaybe<Scalars['String']['input']>;
  staker_contains?: InputMaybe<Scalars['String']['input']>;
  staker_ends_with?: InputMaybe<Scalars['String']['input']>;
  staker_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  staker_not?: InputMaybe<Scalars['String']['input']>;
  staker_not_contains?: InputMaybe<Scalars['String']['input']>;
  staker_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  staker_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  staker_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  staker_starts_with?: InputMaybe<Scalars['String']['input']>;
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

export type StakingReward = {
  __typename?: 'StakingReward';
  address: Scalars['String']['output'];
  amount: Scalars['BigInt']['output'];
  available: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  claimed: Scalars['BigInt']['output'];
  lastUpdate: Scalars['BigInt']['output'];
  staker: Scalars['String']['output'];
};

export type StakingRewardFilter = {
  AND?: InputMaybe<Array<InputMaybe<StakingRewardFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<StakingRewardFilter>>>;
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
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  available?: InputMaybe<Scalars['BigInt']['input']>;
  available_gt?: InputMaybe<Scalars['BigInt']['input']>;
  available_gte?: InputMaybe<Scalars['BigInt']['input']>;
  available_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  available_lt?: InputMaybe<Scalars['BigInt']['input']>;
  available_lte?: InputMaybe<Scalars['BigInt']['input']>;
  available_not?: InputMaybe<Scalars['BigInt']['input']>;
  available_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  claimed?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  claimed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_not?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  lastUpdate?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  lastUpdate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  staker?: InputMaybe<Scalars['String']['input']>;
  staker_contains?: InputMaybe<Scalars['String']['input']>;
  staker_ends_with?: InputMaybe<Scalars['String']['input']>;
  staker_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  staker_not?: InputMaybe<Scalars['String']['input']>;
  staker_not_contains?: InputMaybe<Scalars['String']['input']>;
  staker_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  staker_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  staker_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  staker_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type StakingRewardGlobal = {
  __typename?: 'StakingRewardGlobal';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  cooldownTime: Scalars['BigInt']['output'];
  endTime: Scalars['BigInt']['output'];
  lastUpdate: Scalars['BigInt']['output'];
  startTime: Scalars['BigInt']['output'];
  totalRewards: Scalars['BigInt']['output'];
  totalShares: Scalars['BigInt']['output'];
};

export type StakingRewardGlobalFilter = {
  AND?: InputMaybe<Array<InputMaybe<StakingRewardGlobalFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<StakingRewardGlobalFilter>>>;
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
  cooldownTime?: InputMaybe<Scalars['BigInt']['input']>;
  cooldownTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cooldownTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cooldownTime_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  cooldownTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cooldownTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cooldownTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  cooldownTime_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  endTime?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  endTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  lastUpdate?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  lastUpdate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdate_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  startTime?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  startTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalRewards?: InputMaybe<Scalars['BigInt']['input']>;
  totalRewards_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRewards_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRewards_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalRewards_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRewards_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRewards_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalRewards_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalShares?: InputMaybe<Scalars['BigInt']['input']>;
  totalShares_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalShares_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalShares_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalShares_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalShares_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalShares_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalShares_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type StakingRewardGlobalPage = {
  __typename?: 'StakingRewardGlobalPage';
  items: Array<StakingRewardGlobal>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type StakingRewardPage = {
  __typename?: 'StakingRewardPage';
  items: Array<StakingReward>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};

export enum Link__Purpose {
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  Execution = 'EXECUTION',
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  Security = 'SECURITY'
}

export type GetStakingRewardsQueryVariables = Exact<{
  where?: InputMaybe<StakingRewardFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetStakingRewardsQuery = { __typename?: 'Query', stakingRewards: { __typename?: 'StakingRewardPage', items: Array<{ __typename?: 'StakingReward', chainId: number, address: string, staker: string, amount: any, claimed: any, available: any, lastUpdate: any }>, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetStakingRewardGlobalsQueryVariables = Exact<{
  where?: InputMaybe<StakingRewardGlobalFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetStakingRewardGlobalsQuery = { __typename?: 'Query', stakingRewardGlobals: { __typename?: 'StakingRewardGlobalPage', items: Array<{ __typename?: 'StakingRewardGlobal', chainId: number, address: string, startTime: any, endTime: any, totalRewards: any, totalShares: any, cooldownTime: any, lastUpdate: any }>, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetStakersQueryVariables = Exact<{
  where?: InputMaybe<StakerFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetStakersQuery = { __typename?: 'Query', stakers: { __typename?: 'StakerPage', items: Array<{ __typename?: 'Staker', chainId: number, address: string, staker: string, shares: any, stakedAssets: any, unstakedAssets: any, coolingDown: any, releaseTime: any, lastUpdate: any, computing: any }>, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetSignedStakingRewardQueryVariables = Exact<{
  input: GetSignedStakingRewardInput;
}>;


export type GetSignedStakingRewardQuery = { __typename?: 'Query', getSignedStakingReward?: { __typename?: 'Error' } | { __typename?: 'SignedStakingReward', address?: string | null, amount?: string | null, available?: string | null, chainId?: number | null, claimed?: string | null, lastUpdate?: string | null, staker?: string | null, asset?: string | null, vault?: string | null, signer?: string | null, signature?: string | null } | null };


export const GetStakingRewardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStakingRewards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StakingRewardFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stakingRewards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"staker"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"claimed"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetStakingRewardsQuery, GetStakingRewardsQueryVariables>;
export const GetStakingRewardGlobalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStakingRewardGlobals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StakingRewardGlobalFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stakingRewardGlobals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewards"}},{"kind":"Field","name":{"kind":"Name","value":"totalShares"}},{"kind":"Field","name":{"kind":"Name","value":"cooldownTime"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetStakingRewardGlobalsQuery, GetStakingRewardGlobalsQueryVariables>;
export const GetStakersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStakers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StakerFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stakers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"staker"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"stakedAssets"}},{"kind":"Field","name":{"kind":"Name","value":"unstakedAssets"}},{"kind":"Field","name":{"kind":"Name","value":"coolingDown"}},{"kind":"Field","name":{"kind":"Name","value":"releaseTime"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"computing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetStakersQuery, GetStakersQueryVariables>;
export const GetSignedStakingRewardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSignedStakingReward"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetSignedStakingRewardInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSignedStakingReward"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignedStakingReward"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"claimed"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"staker"}},{"kind":"Field","name":{"kind":"Name","value":"asset"}},{"kind":"Field","name":{"kind":"Name","value":"vault"}},{"kind":"Field","name":{"kind":"Name","value":"signer"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]}}]} as unknown as DocumentNode<GetSignedStakingRewardQuery, GetSignedStakingRewardQueryVariables>;