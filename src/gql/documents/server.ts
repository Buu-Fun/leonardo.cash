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
      ... on LoginChallenge {
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
      ... on Error {
        code
        message
      }
    }
  }
`;

export const LoginAuthMutation = gql`
  mutation LoginAuth($input: LoginAuthInput!) {
    loginAuth(input: $input) {
      ... on LoginAuth {
        token
        tokenExpiry
      }
      ... on Error {
        code
        message
      }
    }
  }
`;

export const LoginRefreshMutation = gql`
  mutation LoginRefresh($input: LoginRefreshInput!) {
    loginRefresh(input: $input) {
      ... on LoginAuth {
        token
        tokenExpiry
      }
      ... on Error {
        code
        message
      }
    }
  }
`;

export const Me = gql`
  query Me {
    me {
      ... on Account {
        address
        twitterId
        twitterName
        twitterUsername
        twitterAvatar
        telegramId
        telegramName
        telegramUsername
        telegramAvatar
        solanaPubKey
        createdAt
        updatedAt
      }
      ... on Error {
        code
        message
      }
    }
  }
`;

export const DisconnectTwitter = gql`
  mutation DisconnectTwitter {
    disconnectTwitter {
      ... on Account {
        address
        twitterId
        twitterName
        twitterUsername
        twitterAvatar
        telegramId
        telegramName
        telegramUsername
        telegramAvatar
        solanaPubKey
        createdAt
        updatedAt
      }
      ... on Error {
        code
        message
      }
    }
  }
`;

export const DisconnectTelegram = gql`
  mutation DisconnectTelegram {
    disconnectTelegram {
      ... on Account {
        address
        twitterId
        twitterName
        twitterUsername
        twitterAvatar
        telegramId
        telegramName
        telegramUsername
        telegramAvatar
        solanaPubKey
        createdAt
        updatedAt
      }
      ... on Error {
        code
        message
      }
    }
  }
`;

export const LinkSolanaRequest = gql`
  mutation LinkSolanaRequest($pubKey: String!) {
    linkSolanaRequest(pubKey: $pubKey) {
      ... on Message {
        message
      }
      ... on Error {
        code
        message
      }
    }
  }
`;

export const LinkSolanaVerify = gql`
  mutation LinkSolanaVerify($signature: String!) {
    linkSolanaVerify(signature: $signature) {
      ... on Account {
        address
        twitterId
        twitterName
        twitterUsername
        twitterAvatar
        telegramId
        telegramName
        telegramUsername
        telegramAvatar
        solanaPubKey
        createdAt
        updatedAt
      }
      ... on Error {
        code
        message
      }
    }
  }
`;

export const UnlinkSolana = gql`
  mutation UnlinkSolana {
    unlinkSolana {
      ... on Account {
        address
        twitterId
        twitterName
        twitterUsername
        twitterAvatar
        telegramId
        telegramName
        telegramUsername
        telegramAvatar
        solanaPubKey
        createdAt
        updatedAt
      }
      ... on Error {
        code
        message
      }
    }
  }
`;
