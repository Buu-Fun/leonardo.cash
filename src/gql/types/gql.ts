/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  mutation LoginChallenge($account: String!) {\n    loginChallenge(account: $account) {\n      ... on LoginChallenge {\n        input {\n          address\n          nonce\n        }\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n": types.LoginChallengeDocument,
    "\n  mutation LoginAuth($output: SolanaSignInOutput!, $input: SolanaSignInInput!) {\n    loginAuth(output: $output, input: $input) {\n      ... on LoginAuth {\n        token\n        tokenExpiry\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n": types.LoginAuthDocument,
    "\n  mutation LoginRefresh($input: LoginRefreshInput!) {\n    loginRefresh(input: $input) {\n      ... on LoginAuth {\n        token\n        tokenExpiry\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n": types.LoginRefreshDocument,
    "\n  query Me {\n    me {\n      ... on Account {\n        address\n        twitterId\n        twitterName\n        twitterUsername\n        twitterAvatar\n        telegramId\n        telegramName\n        telegramUsername\n        telegramAvatar\n        solanaPubKey\n        createdAt\n        updatedAt\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n": types.MeDocument,
    "\n  mutation DisconnectTwitter {\n    disconnectTwitter {\n      ... on Account {\n        address\n        twitterId\n        twitterName\n        twitterUsername\n        twitterAvatar\n        telegramId\n        telegramName\n        telegramUsername\n        telegramAvatar\n        solanaPubKey\n        createdAt\n        updatedAt\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n": types.DisconnectTwitterDocument,
    "\n  mutation DisconnectTelegram {\n    disconnectTelegram {\n      ... on Account {\n        address\n        twitterId\n        twitterName\n        twitterUsername\n        twitterAvatar\n        telegramId\n        telegramName\n        telegramUsername\n        telegramAvatar\n        solanaPubKey\n        createdAt\n        updatedAt\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n": types.DisconnectTelegramDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LoginChallenge($account: String!) {\n    loginChallenge(account: $account) {\n      ... on LoginChallenge {\n        input {\n          address\n          nonce\n        }\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation LoginChallenge($account: String!) {\n    loginChallenge(account: $account) {\n      ... on LoginChallenge {\n        input {\n          address\n          nonce\n        }\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LoginAuth($output: SolanaSignInOutput!, $input: SolanaSignInInput!) {\n    loginAuth(output: $output, input: $input) {\n      ... on LoginAuth {\n        token\n        tokenExpiry\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation LoginAuth($output: SolanaSignInOutput!, $input: SolanaSignInInput!) {\n    loginAuth(output: $output, input: $input) {\n      ... on LoginAuth {\n        token\n        tokenExpiry\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LoginRefresh($input: LoginRefreshInput!) {\n    loginRefresh(input: $input) {\n      ... on LoginAuth {\n        token\n        tokenExpiry\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation LoginRefresh($input: LoginRefreshInput!) {\n    loginRefresh(input: $input) {\n      ... on LoginAuth {\n        token\n        tokenExpiry\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      ... on Account {\n        address\n        twitterId\n        twitterName\n        twitterUsername\n        twitterAvatar\n        telegramId\n        telegramName\n        telegramUsername\n        telegramAvatar\n        solanaPubKey\n        createdAt\n        updatedAt\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      ... on Account {\n        address\n        twitterId\n        twitterName\n        twitterUsername\n        twitterAvatar\n        telegramId\n        telegramName\n        telegramUsername\n        telegramAvatar\n        solanaPubKey\n        createdAt\n        updatedAt\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DisconnectTwitter {\n    disconnectTwitter {\n      ... on Account {\n        address\n        twitterId\n        twitterName\n        twitterUsername\n        twitterAvatar\n        telegramId\n        telegramName\n        telegramUsername\n        telegramAvatar\n        solanaPubKey\n        createdAt\n        updatedAt\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DisconnectTwitter {\n    disconnectTwitter {\n      ... on Account {\n        address\n        twitterId\n        twitterName\n        twitterUsername\n        twitterAvatar\n        telegramId\n        telegramName\n        telegramUsername\n        telegramAvatar\n        solanaPubKey\n        createdAt\n        updatedAt\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DisconnectTelegram {\n    disconnectTelegram {\n      ... on Account {\n        address\n        twitterId\n        twitterName\n        twitterUsername\n        twitterAvatar\n        telegramId\n        telegramName\n        telegramUsername\n        telegramAvatar\n        solanaPubKey\n        createdAt\n        updatedAt\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DisconnectTelegram {\n    disconnectTelegram {\n      ... on Account {\n        address\n        twitterId\n        twitterName\n        twitterUsername\n        twitterAvatar\n        telegramId\n        telegramName\n        telegramUsername\n        telegramAvatar\n        solanaPubKey\n        createdAt\n        updatedAt\n      }\n      ... on Error {\n        code\n        message\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;