import { gql } from 'graphql-request';

export const GetSignedStakingReward = gql`
  query GetSignedStakingReward($input: GetSignedStakingRewardInput!) {
    getSignedStakingReward(input: $input) {
      ... on SignedStakingReward {
        address
        amount
        available
        chainId
        claimed
        lastUpdate
        staker
        asset
        vault
        signer
        signature
      }
    }
  }
`;
