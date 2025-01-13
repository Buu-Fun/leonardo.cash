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
    "\n  query GetStakingRewards(\n    $where: StakingRewardFilter\n    $orderBy: String\n    $orderDirection: String\n    $limit: Int\n    $after: String\n    $before: String\n  ) {\n    stakingRewards(\n      where: $where\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      limit: $limit\n      after: $after\n      before: $before\n    ) {\n      items {\n        chainId\n        address\n        staker\n        amount\n        claimed\n        available\n        lastUpdate\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": types.GetStakingRewardsDocument,
    "\n  query GetStakingRewardGlobals(\n    $where: StakingRewardGlobalFilter\n    $orderBy: String\n    $orderDirection: String\n    $limit: Int\n    $after: String\n    $before: String\n  ) {\n    stakingRewardGlobals(\n      where: $where\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      limit: $limit\n      after: $after\n      before: $before\n    ) {\n      items {\n        chainId\n        address\n        startTime\n        endTime\n        totalRewards\n        totalShares\n        lastUpdate\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": types.GetStakingRewardGlobalsDocument,
    "\n  query GetStakers(\n    $where: StakerFilter\n    $orderBy: String\n    $orderDirection: String\n    $limit: Int\n    $after: String\n    $before: String\n  ) {\n    stakers(\n      where: $where\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      limit: $limit\n      after: $after\n      before: $before\n    ) {\n      items {\n        chainId\n        address\n        staker\n        shares\n        stakedAssets\n        unstakedAssets\n        lastUpdate\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": types.GetStakersDocument,
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
export function graphql(source: "\n  query GetStakingRewards(\n    $where: StakingRewardFilter\n    $orderBy: String\n    $orderDirection: String\n    $limit: Int\n    $after: String\n    $before: String\n  ) {\n    stakingRewards(\n      where: $where\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      limit: $limit\n      after: $after\n      before: $before\n    ) {\n      items {\n        chainId\n        address\n        staker\n        amount\n        claimed\n        available\n        lastUpdate\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetStakingRewards(\n    $where: StakingRewardFilter\n    $orderBy: String\n    $orderDirection: String\n    $limit: Int\n    $after: String\n    $before: String\n  ) {\n    stakingRewards(\n      where: $where\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      limit: $limit\n      after: $after\n      before: $before\n    ) {\n      items {\n        chainId\n        address\n        staker\n        amount\n        claimed\n        available\n        lastUpdate\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetStakingRewardGlobals(\n    $where: StakingRewardGlobalFilter\n    $orderBy: String\n    $orderDirection: String\n    $limit: Int\n    $after: String\n    $before: String\n  ) {\n    stakingRewardGlobals(\n      where: $where\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      limit: $limit\n      after: $after\n      before: $before\n    ) {\n      items {\n        chainId\n        address\n        startTime\n        endTime\n        totalRewards\n        totalShares\n        lastUpdate\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetStakingRewardGlobals(\n    $where: StakingRewardGlobalFilter\n    $orderBy: String\n    $orderDirection: String\n    $limit: Int\n    $after: String\n    $before: String\n  ) {\n    stakingRewardGlobals(\n      where: $where\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      limit: $limit\n      after: $after\n      before: $before\n    ) {\n      items {\n        chainId\n        address\n        startTime\n        endTime\n        totalRewards\n        totalShares\n        lastUpdate\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetStakers(\n    $where: StakerFilter\n    $orderBy: String\n    $orderDirection: String\n    $limit: Int\n    $after: String\n    $before: String\n  ) {\n    stakers(\n      where: $where\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      limit: $limit\n      after: $after\n      before: $before\n    ) {\n      items {\n        chainId\n        address\n        staker\n        shares\n        stakedAssets\n        unstakedAssets\n        lastUpdate\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetStakers(\n    $where: StakerFilter\n    $orderBy: String\n    $orderDirection: String\n    $limit: Int\n    $after: String\n    $before: String\n  ) {\n    stakers(\n      where: $where\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      limit: $limit\n      after: $after\n      before: $before\n    ) {\n      items {\n        chainId\n        address\n        staker\n        shares\n        stakedAssets\n        unstakedAssets\n        lastUpdate\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;