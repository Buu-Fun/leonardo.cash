import { Staker } from '../gql/types/graphql';

export enum Tiers {
  Top1 = 'Top1',
  Top2 = 'Top2',
  Top3 = 'Top3',
  Top5 = 'Top5',
  Top10 = 'Top10',
  Top25 = 'Top25',
  Top50 = 'Top50',
  Top100 = 'Top100',
}

export const BoosterValues = {
  [Tiers.Top1]: 100n,
  [Tiers.Top2]: 80n,
  [Tiers.Top3]: 60n,
  [Tiers.Top5]: 40n,
  [Tiers.Top10]: 20n,
  [Tiers.Top25]: 10n,
  [Tiers.Top50]: 5n,
  [Tiers.Top100]: 2n,
} as {
  [tier in Tiers]: bigint;
};

export const getBoosterValue = (index: number) => {
  if (index > 100) {
    return 0n;
  } else if (index > 50) {
    return BoosterValues[Tiers.Top100];
  } else if (index > 25) {
    return BoosterValues[Tiers.Top50];
  } else if (index > 10) {
    return BoosterValues[Tiers.Top25];
  } else if (index > 5) {
    return BoosterValues[Tiers.Top10];
  } else if (index > 3) {
    return BoosterValues[Tiers.Top5];
  } else if (index > 2) {
    return BoosterValues[Tiers.Top3];
  }
  return BoosterValues[Tiers.Top1];
};

// Ponderate the shares of the staker considering the cooling down (released share does not count)
export function calculateSharesSinceLastUpdate({
  staker,
  now,
  timeSinceLastUpdate,
}: {
  staker: Staker;
  now: bigint;
  timeSinceLastUpdate: bigint;
}) {
  // This is the value of the shares pre released
  const sharesPreReleasedMul = BigInt(staker.shares);
  // This is the value of the shares after released
  const sharesAfterReleasedMul =
    BigInt(staker.shares) - BigInt(staker.coolingDown);

  /**
   * Case 0: If now is less than timeSinceLastUpdate, it means that the time is not valid
   * */
  if (now < timeSinceLastUpdate) {
    return 0n;
  }

  /**
   * Case 1: Release is not yet done (compute only pre-release)
   */
  if (now < BigInt(staker.releaseTime)) {
    // const preReleaseShares = sharesPreReleasedMul * (now - timeSinceLastUpdate);
    // return preReleaseShares / (now - timeSinceLastUpdate);
    return sharesPreReleasedMul;
  }

  /**
   * Case 2: Release is done and last update was after releaseTime (compute only post-release)
   * now > releaseTime
   */
  if (BigInt(staker.releaseTime) < timeSinceLastUpdate) {
    // const postReleaseShares =
    //   sharesAfterReleasedMul * (now - timeSinceLastUpdate);
    // return postReleaseShares / (now - timeSinceLastUpdate);
    return sharesAfterReleasedMul;
  }

  /**
   * Case 3: Compute both pre-release and post-release
   * now > releaseTime && releaseTime > timeSinceLastUpdate
   */
  const preReleaseShares =
    sharesPreReleasedMul * (BigInt(staker.releaseTime) - timeSinceLastUpdate);
  const postReleaseShares =
    sharesAfterReleasedMul * (now - BigInt(staker.releaseTime));
  return (preReleaseShares + postReleaseShares) / (now - timeSinceLastUpdate);
}
