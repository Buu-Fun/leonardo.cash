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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  address: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  solanaPubKey?: Maybe<Scalars['String']['output']>;
  telegramAvatar?: Maybe<Scalars['String']['output']>;
  telegramId?: Maybe<Scalars['Float']['output']>;
  telegramName?: Maybe<Scalars['String']['output']>;
  telegramUsername?: Maybe<Scalars['String']['output']>;
  twitterAvatar?: Maybe<Scalars['String']['output']>;
  twitterEmail?: Maybe<Scalars['String']['output']>;
  twitterId?: Maybe<Scalars['String']['output']>;
  twitterName?: Maybe<Scalars['String']['output']>;
  twitterUsername?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type AccountResult = Account | Error;

export type Error = {
  __typename?: 'Error';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type LoginAuth = {
  __typename?: 'LoginAuth';
  token: Scalars['String']['output'];
  tokenExpiry: Scalars['DateTimeISO']['output'];
};

export type LoginAuthResult = Error | LoginAuth;

export type LoginChallenge = {
  __typename?: 'LoginChallenge';
  input: SolanaSignIn;
};

export type LoginChallengeResult = Error | LoginChallenge;

export type LoginRefreshInput = {
  account: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  disconnectTelegram: AccountResult;
  disconnectTwitter: AccountResult;
  linkSolana: AccountResult;
  loginAuth: LoginAuthResult;
  loginChallenge: LoginChallengeResult;
  loginRefresh: LoginAuthResult;
  unlinkSolana: AccountResult;
};


export type MutationLinkSolanaArgs = {
  solanaPubKey: Scalars['String']['input'];
};


export type MutationLoginAuthArgs = {
  input: SolanaSignInInput;
  output: SolanaSignInOutput;
};


export type MutationLoginChallengeArgs = {
  account: Scalars['String']['input'];
};


export type MutationLoginRefreshArgs = {
  input: LoginRefreshInput;
};

export type Query = {
  __typename?: 'Query';
  me: AccountResult;
};

export type SolanaSignIn = {
  __typename?: 'SolanaSignIn';
  address: Scalars['String']['output'];
  nonce: Scalars['String']['output'];
};

export type SolanaSignInInput = {
  address: Scalars['String']['input'];
  nonce: Scalars['String']['input'];
};

export type SolanaSignInOutput = {
  account: WalletAccount;
  signature: Scalars['String']['input'];
  signatureType: Scalars['String']['input'];
  signedMessage: Scalars['String']['input'];
};

export type WalletAccount = {
  address: Scalars['String']['input'];
  chains: Array<Scalars['String']['input']>;
  features: Array<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  publicKey: Scalars['String']['input'];
};

export type LoginChallengeMutationVariables = Exact<{
  account: Scalars['String']['input'];
}>;


export type LoginChallengeMutation = { __typename?: 'Mutation', loginChallenge: { __typename?: 'Error', code: string, message: string } | { __typename?: 'LoginChallenge', input: { __typename?: 'SolanaSignIn', address: string, nonce: string } } };

export type LoginAuthMutationVariables = Exact<{
  output: SolanaSignInOutput;
  input: SolanaSignInInput;
}>;


export type LoginAuthMutation = { __typename?: 'Mutation', loginAuth: { __typename?: 'Error', code: string, message: string } | { __typename?: 'LoginAuth', token: string, tokenExpiry: any } };

export type LoginRefreshMutationVariables = Exact<{
  input: LoginRefreshInput;
}>;


export type LoginRefreshMutation = { __typename?: 'Mutation', loginRefresh: { __typename?: 'Error', code: string, message: string } | { __typename?: 'LoginAuth', token: string, tokenExpiry: any } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'Account', address: string, twitterId?: string | null, twitterName?: string | null, twitterUsername?: string | null, twitterAvatar?: string | null, telegramId?: number | null, telegramName?: string | null, telegramUsername?: string | null, telegramAvatar?: string | null, solanaPubKey?: string | null, createdAt: any, updatedAt: any } | { __typename?: 'Error', code: string, message: string } };

export type DisconnectTwitterMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectTwitterMutation = { __typename?: 'Mutation', disconnectTwitter: { __typename?: 'Account', address: string, twitterId?: string | null, twitterName?: string | null, twitterUsername?: string | null, twitterAvatar?: string | null, telegramId?: number | null, telegramName?: string | null, telegramUsername?: string | null, telegramAvatar?: string | null, solanaPubKey?: string | null, createdAt: any, updatedAt: any } | { __typename?: 'Error', code: string, message: string } };

export type DisconnectTelegramMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectTelegramMutation = { __typename?: 'Mutation', disconnectTelegram: { __typename?: 'Account', address: string, twitterId?: string | null, twitterName?: string | null, twitterUsername?: string | null, twitterAvatar?: string | null, telegramId?: number | null, telegramName?: string | null, telegramUsername?: string | null, telegramAvatar?: string | null, solanaPubKey?: string | null, createdAt: any, updatedAt: any } | { __typename?: 'Error', code: string, message: string } };


export const LoginChallengeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginChallenge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginChallenge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"account"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginChallenge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"input"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"nonce"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<LoginChallengeMutation, LoginChallengeMutationVariables>;
export const LoginAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginAuth"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"output"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaSignInOutput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SolanaSignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginAuth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"output"},"value":{"kind":"Variable","name":{"kind":"Name","value":"output"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginAuth"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"tokenExpiry"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<LoginAuthMutation, LoginAuthMutationVariables>;
export const LoginRefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginRefresh"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginRefreshInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginRefresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginAuth"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"tokenExpiry"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<LoginRefreshMutation, LoginRefreshMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"twitterId"}},{"kind":"Field","name":{"kind":"Name","value":"twitterName"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUsername"}},{"kind":"Field","name":{"kind":"Name","value":"twitterAvatar"}},{"kind":"Field","name":{"kind":"Name","value":"telegramId"}},{"kind":"Field","name":{"kind":"Name","value":"telegramName"}},{"kind":"Field","name":{"kind":"Name","value":"telegramUsername"}},{"kind":"Field","name":{"kind":"Name","value":"telegramAvatar"}},{"kind":"Field","name":{"kind":"Name","value":"solanaPubKey"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const DisconnectTwitterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DisconnectTwitter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disconnectTwitter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"twitterId"}},{"kind":"Field","name":{"kind":"Name","value":"twitterName"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUsername"}},{"kind":"Field","name":{"kind":"Name","value":"twitterAvatar"}},{"kind":"Field","name":{"kind":"Name","value":"telegramId"}},{"kind":"Field","name":{"kind":"Name","value":"telegramName"}},{"kind":"Field","name":{"kind":"Name","value":"telegramUsername"}},{"kind":"Field","name":{"kind":"Name","value":"telegramAvatar"}},{"kind":"Field","name":{"kind":"Name","value":"solanaPubKey"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<DisconnectTwitterMutation, DisconnectTwitterMutationVariables>;
export const DisconnectTelegramDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DisconnectTelegram"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disconnectTelegram"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"twitterId"}},{"kind":"Field","name":{"kind":"Name","value":"twitterName"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUsername"}},{"kind":"Field","name":{"kind":"Name","value":"twitterAvatar"}},{"kind":"Field","name":{"kind":"Name","value":"telegramId"}},{"kind":"Field","name":{"kind":"Name","value":"telegramName"}},{"kind":"Field","name":{"kind":"Name","value":"telegramUsername"}},{"kind":"Field","name":{"kind":"Name","value":"telegramAvatar"}},{"kind":"Field","name":{"kind":"Name","value":"solanaPubKey"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<DisconnectTelegramMutation, DisconnectTelegramMutationVariables>;