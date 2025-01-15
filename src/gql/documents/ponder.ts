import { gql } from 'graphql-request';

export const GetStakingRewards = gql`
  query GetStakingRewards(
    $where: StakingRewardFilter
    $orderBy: String
    $orderDirection: String
    $limit: Int
    $after: String
    $before: String
  ) {
    stakingRewards(
      where: $where
      orderBy: $orderBy
      orderDirection: $orderDirection
      limit: $limit
      after: $after
      before: $before
    ) {
      items {
        chainId
        address
        staker
        amount
        claimed
        available
        lastUpdate
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GetStakingRewardGlobals = gql`
  query GetStakingRewardGlobals(
    $where: StakingRewardGlobalFilter
    $orderBy: String
    $orderDirection: String
    $limit: Int
    $after: String
    $before: String
  ) {
    stakingRewardGlobals(
      where: $where
      orderBy: $orderBy
      orderDirection: $orderDirection
      limit: $limit
      after: $after
      before: $before
    ) {
      items {
        chainId
        address
        startTime
        endTime
        totalRewards
        totalShares
        cooldownTime
        lastUpdate
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GetStakers = gql`
  query GetStakers(
    $where: StakerFilter
    $orderBy: String
    $orderDirection: String
    $limit: Int
    $after: String
    $before: String
  ) {
    stakers(
      where: $where
      orderBy: $orderBy
      orderDirection: $orderDirection
      limit: $limit
      after: $after
      before: $before
    ) {
      items {
        chainId
        address
        staker
        shares
        coolingDown
        releaseTime
        lastUpdate
        computing
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
