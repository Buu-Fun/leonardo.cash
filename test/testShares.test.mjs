import assert from 'assert';

function calculateBoostedSharesSinceLastUpdate({
  staker,
  now,
  timeSinceLastUpdate,
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

describe('Tests para calculateBoostedSharesSinceLastUpdate', () => {
  it('Test 1: Sin período de cooldown, now < releaseTime', () => {
    const input = {
      staker: {
        shares: 100,
        coolingDown: 0,
        releaseTime: 0,
      },
      now: 100n,
      timeSinceLastUpdate: 0n,
    };

    const result = calculateBoostedSharesSinceLastUpdate(input);
    assert.strictEqual(result, 100n);
  });

  it('Test 2: Con cooldown, now < releaseTime', () => {
    const input = {
      staker: {
        shares: 100,
        coolingDown: 50,
        releaseTime: 100,
      },
      now: 100n,
      timeSinceLastUpdate: 0n,
    };

    const result = calculateBoostedSharesSinceLastUpdate(input);
    assert.strictEqual(result, 100n);
  });

  it('Test 3: Con cooldown, now > releaseTime', () => {
    const input = {
      staker: {
        shares: 100,
        coolingDown: 100,
        releaseTime: 100,
      },
      now: 200n,
      timeSinceLastUpdate: 0n,
    };

    const result = calculateBoostedSharesSinceLastUpdate(input);
    assert.strictEqual(result, 50n);
  });

  it('Test 4: Con cooldown, now > releaseTime', () => {
    const input = {
      staker: {
        shares: 100,
        coolingDown: 100,
        releaseTime: 100,
      },
      now: 400n,
      timeSinceLastUpdate: 0n,
    };

    const result = calculateBoostedSharesSinceLastUpdate(input);
    assert.strictEqual(result, 25n);
  });

  it('Test 5: Con cooldown, now > releaseTime && timeSinceLastUpdate > releaseTime', () => {
    const input = {
      staker: {
        shares: 100,
        coolingDown: 100,
        releaseTime: 100,
      },
      now: 400n,
      timeSinceLastUpdate: 300n,
    };

    const result = calculateBoostedSharesSinceLastUpdate(input);
    assert.strictEqual(result, 0n);
  });

  //   it('Test 4: Periodo posterior a releaseTime (sin cooldown)', () => {
  //     const input = {
  //       staker: {
  //         shares: 120,
  //         coolingDown: 0,
  //         releaseTime: 2500,
  //       },
  //       now: 3000n,
  //       timeSinceLastUpdate: 2000n,
  //     };

  //     const result = calculateBoostedSharesSinceLastUpdate(input);
  //     // Intervalo total: 2000 -> 3000 (1000 unidades).
  //     // ReleaseTime cae en 2500, así que:
  //     // - Pre-release: 2000 a 2500 (500 unidades) con 120 shares => 120 * 500 = 60000
  //     // - Post-release: 2500 a 3000 (500 unidades) con 120 shares => 120 * 500 = 60000
  //     // boost total = 60000 + 60000 = 120000
  //     // 120000 / (3000 - 2000 = 1000) = 120
  //     assert.strictEqual(result, 120n);
  //   });

  //   it('Test 5: Periodo posterior a releaseTime (con cooldown)', () => {
  //     const input = {
  //       staker: {
  //         shares: 100,
  //         coolingDown: 20,
  //         releaseTime: 2500,
  //       },
  //       now: 3000n,
  //       timeSinceLastUpdate: 2000n,
  //     };

  //     const result = calculateBoostedSharesSinceLastUpdate(input);
  //     // Intervalo total: 2000 -> 3000 (1000 unidades).
  //     // - Pre-release: 2000 a 2500 (500 unidades) con 100 shares => 100 * 500 = 50000
  //     // - Post-release: 2500 a 3000 (500 unidades) con (100 - 20) = 80 shares => 80 * 500 = 40000
  //     // total = 90000
  //     // 90000 / 1000 = 90
  //     assert.strictEqual(result, 90n);
  //   });

  //   it('Test 6: releaseTime < timeSinceLastUpdate', () => {
  //     const input = {
  //       staker: {
  //         shares: 200,
  //         coolingDown: 60,
  //         releaseTime: 1000,
  //       },
  //       now: 2000n,
  //       timeSinceLastUpdate: 1500n,
  //     };

  //     const result = calculateBoostedSharesSinceLastUpdate(input);
  //     // Intervalo: 1500 -> 2000 (500 unidades).
  //     // releaseTime = 1000 < 1500, así que todo el tiempo está en post-release,
  //     // => shares (200 - 60) = 140
  //     // boostedSharesPreReleased = 0n (no hay tiempo pre-release)
  //     // boostedSharesAfterReleased = 140 * 500 = 70000
  //     // 70000 / 500 = 140
  //     assert.strictEqual(result, 140n);
  //   });
});
