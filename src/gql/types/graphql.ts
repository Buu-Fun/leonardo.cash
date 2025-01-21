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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type Eip712Domain = {
  __typename?: 'EIP712Domain';
  name: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type Eip712Type = {
  __typename?: 'EIP712Type';
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type Eip712Types = {
  __typename?: 'EIP712Types';
  Login: Array<Eip712Type>;
};

export type Eip712Value = {
  __typename?: 'EIP712Value';
  account: Scalars['String']['output'];
  nonce: Scalars['String']['output'];
};

export type Error = {
  __typename?: 'Error';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type GetSignedStakingRewardInput = {
  chainId: Scalars['Float']['input'];
  stakerAddress: Scalars['String']['input'];
};

export type LoginAuth = {
  __typename?: 'LoginAuth';
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
  tokenExpiry: Scalars['DateTimeISO']['output'];
};

export type LoginAuthInput = {
  account: Scalars['String']['input'];
  signature: Scalars['String']['input'];
};

export type LoginChallenge = {
  __typename?: 'LoginChallenge';
  domain: Eip712Domain;
  types: Eip712Types;
  value: Eip712Value;
};

export type LoginRefreshInput = {
  account: Scalars['String']['input'];
  refreshToken: Scalars['String']['input'];
};

export type Meta = {
  __typename?: 'Meta';
  status?: Maybe<Scalars['JSON']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  loginAuth: LoginAuth;
  loginChallenge: LoginChallenge;
  loginRefresh: LoginAuth;
};


export type MutationLoginAuthArgs = {
  input: LoginAuthInput;
};


export type MutationLoginChallengeArgs = {
  account: Scalars['String']['input'];
};


export type MutationLoginRefreshArgs = {
  input: LoginRefreshInput;
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
  checkAuth: Scalars['Boolean']['output'];
  getSignedStakingReward: SearchResult;
  role?: Maybe<Role>;
  roles: RolePage;
  staker?: Maybe<Staker>;
  stakers: StakerPage;
  stakingReward?: Maybe<StakingReward>;
  stakingRewardGlobal?: Maybe<StakingRewardGlobal>;
  stakingRewardGlobals: StakingRewardGlobalPage;
  stakingRewards: StakingRewardPage;
};


export type QueryGetSignedStakingRewardArgs = {
  input: GetSignedStakingRewardInput;
};


export type QueryRoleArgs = {
  account: Scalars['String']['input'];
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
  role: Scalars['String']['input'];
};


export type QueryRolesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<RoleFilter>;
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

export type Role = {
  __typename?: 'Role';
  account: Scalars['String']['output'];
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  lastUpdate: Scalars['BigInt']['output'];
  role: Scalars['String']['output'];
};

export type RoleFilter = {
  AND?: InputMaybe<Array<InputMaybe<RoleFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<RoleFilter>>>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
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
  role?: InputMaybe<Scalars['String']['input']>;
  role_contains?: InputMaybe<Scalars['String']['input']>;
  role_ends_with?: InputMaybe<Scalars['String']['input']>;
  role_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  role_not?: InputMaybe<Scalars['String']['input']>;
  role_not_contains?: InputMaybe<Scalars['String']['input']>;
  role_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  role_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  role_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  role_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type RolePage = {
  __typename?: 'RolePage';
  items: Array<Role>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SearchResult = Error | SignedStakingReward;

export type SignedStakingReward = {
  __typename?: 'SignedStakingReward';
  address: Scalars['String']['output'];
  amount: Scalars['String']['output'];
  asset: Scalars['String']['output'];
  chainId: Scalars['Float']['output'];
  claimed: Scalars['String']['output'];
  lastUpdate: Scalars['String']['output'];
  signature: Scalars['String']['output'];
  signer: Scalars['String']['output'];
  staker: Scalars['String']['output'];
  vault: Scalars['String']['output'];
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
  staker: Scalars['String']['output'];
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
  totalAssets: Scalars['BigInt']['output'];
  totalRewarded: Scalars['BigInt']['output'];
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
  totalAssets?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssets_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssets_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssets_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalAssets_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssets_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssets_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssets_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalRewarded?: InputMaybe<Scalars['BigInt']['input']>;
  totalRewarded_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRewarded_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRewarded_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalRewarded_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRewarded_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRewarded_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalRewarded_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
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

export type GetStakingRewardsQueryVariables = Exact<{
  where?: InputMaybe<StakingRewardFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetStakingRewardsQuery = { __typename?: 'Query', stakingRewards: { __typename?: 'StakingRewardPage', items: Array<{ __typename?: 'StakingReward', chainId: number, address: string, staker: string, amount: any, claimed: any, lastUpdate: any }>, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetStakingRewardGlobalsQueryVariables = Exact<{
  where?: InputMaybe<StakingRewardGlobalFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetStakingRewardGlobalsQuery = { __typename?: 'Query', stakingRewardGlobals: { __typename?: 'StakingRewardGlobalPage', items: Array<{ __typename?: 'StakingRewardGlobal', chainId: number, address: string, startTime: any, endTime: any, totalRewards: any, totalShares: any, totalAssets: any, cooldownTime: any, lastUpdate: any }>, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetStakersQueryVariables = Exact<{
  where?: InputMaybe<StakerFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetStakersQuery = { __typename?: 'Query', stakers: { __typename?: 'StakerPage', items: Array<{ __typename?: 'Staker', chainId: number, address: string, staker: string, shares: any, coolingDown: any, releaseTime: any, lastUpdate: any, computing: any }>, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetSignedStakingRewardQueryVariables = Exact<{
  input: GetSignedStakingRewardInput;
}>;


export type GetSignedStakingRewardQuery = { __typename?: 'Query', getSignedStakingReward: { __typename?: 'Error' } | { __typename?: 'SignedStakingReward', address: string, amount: string, chainId: number, claimed: string, lastUpdate: string, staker: string, asset: string, vault: string, signer: string, signature: string } };

export type LoginChallengeMutationVariables = Exact<{
  account: Scalars['String']['input'];
}>;


export type LoginChallengeMutation = { __typename?: 'Mutation', loginChallenge: { __typename?: 'LoginChallenge', domain: { __typename?: 'EIP712Domain', name: string, version: string }, types: { __typename?: 'EIP712Types', Login: Array<{ __typename?: 'EIP712Type', name: string, type: string }> }, value: { __typename?: 'EIP712Value', account: string, nonce: string } } };

export type LoginAuthMutationVariables = Exact<{
  input: LoginAuthInput;
}>;


export type LoginAuthMutation = { __typename?: 'Mutation', loginAuth: { __typename?: 'LoginAuth', refreshToken: string, token: string, tokenExpiry: any } };

export type LoginRefreshMutationVariables = Exact<{
  input: LoginRefreshInput;
}>;


export type LoginRefreshMutation = { __typename?: 'Mutation', loginRefresh: { __typename?: 'LoginAuth', refreshToken: string, token: string, tokenExpiry: any } };


export const GetStakingRewardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStakingRewards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StakingRewardFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stakingRewards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"staker"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"claimed"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetStakingRewardsQuery, GetStakingRewardsQueryVariables>;
export const GetStakingRewardGlobalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStakingRewardGlobals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StakingRewardGlobalFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stakingRewardGlobals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"totalRewards"}},{"kind":"Field","name":{"kind":"Name","value":"totalShares"}},{"kind":"Field","name":{"kind":"Name","value":"totalAssets"}},{"kind":"Field","name":{"kind":"Name","value":"cooldownTime"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetStakingRewardGlobalsQuery, GetStakingRewardGlobalsQueryVariables>;
export const GetStakersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStakers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StakerFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stakers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"staker"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"coolingDown"}},{"kind":"Field","name":{"kind":"Name","value":"releaseTime"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"computing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetStakersQuery, GetStakersQueryVariables>;
export const GetSignedStakingRewardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSignedStakingReward"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetSignedStakingRewardInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSignedStakingReward"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignedStakingReward"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"claimed"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"staker"}},{"kind":"Field","name":{"kind":"Name","value":"asset"}},{"kind":"Field","name":{"kind":"Name","value":"vault"}},{"kind":"Field","name":{"kind":"Name","value":"signer"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]}}]} as unknown as DocumentNode<GetSignedStakingRewardQuery, GetSignedStakingRewardQueryVariables>;
export const LoginChallengeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginChallenge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginChallenge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"account"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}},{"kind":"Field","name":{"kind":"Name","value":"types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Login"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"}},{"kind":"Field","name":{"kind":"Name","value":"nonce"}}]}}]}}]}}]} as unknown as DocumentNode<LoginChallengeMutation, LoginChallengeMutationVariables>;
export const LoginAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginAuth"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginAuthInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginAuth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"tokenExpiry"}}]}}]}}]} as unknown as DocumentNode<LoginAuthMutation, LoginAuthMutationVariables>;
export const LoginRefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginRefresh"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginRefreshInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginRefresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"tokenExpiry"}}]}}]}}]} as unknown as DocumentNode<LoginRefreshMutation, LoginRefreshMutationVariables>;