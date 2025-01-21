import { gql } from 'graphql-request';

export const GetSignedStakingReward = gql`
  query GetSignedStakingReward($input: GetSignedStakingRewardInput!) {
    getSignedStakingReward(input: $input) {
      ... on SignedStakingReward {
        address
        amount
        chainId
        claimed
        lastUpdate
        staker
        asset
        vault
        signer
        signature
      }
      ... on Error {
        code
        message
      }
    }
  }
`;

export const LoginChallengeMutation = gql`
  mutation LoginChallenge($account: String!) {
    loginChallenge(account: $account) {
      domain {
        name
        version
      }
      types {
        Login {
          name
          type
        }
      }
      value {
        account
        nonce
      }
    }
  }
`;

export const LoginAuthMutation = gql`
  mutation LoginAuth($input: LoginAuthInput!) {
    loginAuth(input: $input) {
      refreshToken
      token
      tokenExpiry
    }
  }
`;

export const LoginRefreshMutation = gql`
  mutation LoginRefresh($input: LoginRefreshInput!) {
    loginRefresh(input: $input) {
      refreshToken
      token
      tokenExpiry
    }
  }
`;
