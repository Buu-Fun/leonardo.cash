import { gql } from 'graphql-request';

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
        address
        chainId
        shares
        stakedAssets
        unstakedAssets
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
