import { Button } from '@nextui-org/react';
import { TokenInput } from './TokenInput';
import { useMemo, useState } from 'react';
import { usePrice } from '@/src/context/price.context';
import { createPublicClient, Hex, http } from 'viem';
import { ASSET_ADDRESS, POOL_ADDRESS } from '@/src/config';
import { useAccount, useBalance } from 'wagmi';
import { usePool, useQuote, useSwap } from './uniswap/hooks';

function Buy() {
  const [sellAmount, setSellAmount] = useState(0n);
  // const [buyAmount, setBuyAmount] = useState(0n);
  const { price, wethPrice } = usePrice();
  const { address } = useAccount();
  const { pool } = usePool(POOL_ADDRESS as Hex);
  const { quote } = useQuote(pool, sellAmount);
  const { swap, isLoading: isSwaping } = useSwap(pool, sellAmount);
  const buyAmount = quote?.amount ?? 0n;

  const ethBalance = useBalance({ address });
  const leonBalance = useBalance({ address, token: ASSET_ADDRESS as Hex });

  const ETH = {
    symbol: 'ETH',
    icon: '/eth.png',
    decimals: 18,
    usd: wethPrice,
    balance: ethBalance.data?.value,
  };

  const LEONARDO = {
    symbol: 'LEONAI',
    icon: '/leonai.png',
    decimals: 18,
    usd: price,
    balance: leonBalance.data?.value,
  };

  const hasEnough = sellAmount <= (ETH.balance ?? 0n) - (quote?.gas ?? 0n);

  return (
    <form className="w-full">
      <TokenInput
        isValid={hasEnough}
        label="Sell"
        amount={sellAmount}
        setAmount={setSellAmount}
        token={ETH}
      />
      <TokenInput
        isValid={buyAmount > 0n}
        readonly={true}
        label="Buy"
        amount={quote?.amount ?? 0n}
        setAmount={() => {}}
        token={LEONARDO}
      />

      <BuyButton
        isSwaping={isSwaping}
        isReady={true}
        needApproval={false}
        hasEnough={hasEnough}
        approve={() => {}}
        buy={swap}
      />

      <a
        href="https://app.uniswap.org/swap?exactField=output&&outputCurrency=0xb933D4FF5A0e7bFE6AB7Da72b5DCE2259030252f&inputCurrency=ETH&chain=base"
        target="_blank"
        rel="noreferrer"
        style={{ width: '100%', fontSize: '0.8rem' }}
      >
        Buy on Uniswap
      </a>
    </form>
  );
}

type BuyButtonProps = {
  hasEnough: boolean;
  isSwaping: boolean;
  needApproval: boolean;
  isReady: boolean;
  approve: () => void;
  buy: () => void;
};

function BuyButton({
  approve,
  buy,
  isReady,
  needApproval,
  isSwaping,
  hasEnough,
}: BuyButtonProps) {
  const style = { width: '100%' };

  if (!isReady) return <></>;

  if (isSwaping) {
    return (
      <Button disabled={true} color="primary" style={style} onPress={approve}>
        Buying...
      </Button>
    );
  }

  if (needApproval) {
    return (
      <Button color="primary" style={style} onPress={approve}>
        Approve
      </Button>
    );
  }

  if (!hasEnough) {
    return (
      <Button disabled={true} color="primary" style={style}>
        Insufficient Funds
      </Button>
    );
  }

  return (
    <Button color="primary" style={style} onPress={buy}>
      Buy Leonardo
    </Button>
  );
}
export default Buy;
