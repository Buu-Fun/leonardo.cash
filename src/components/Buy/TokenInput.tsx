import { formatUnits } from 'viem';
import { BigIntInput } from './BigIntInput';
import styles from './tokeninput.module.css';
import clsx from 'clsx';

interface Props {
  label: string;
  amount: bigint;
  isValid: boolean;
  setAmount: (amount: bigint) => void;
  readonly?: boolean;
  token: {
    symbol: string;
    icon: string;
    decimals: number;
    usd?: number;
    balance?: bigint;
  };
}

function value(amount?: bigint, usd: number = 0, decimals = 18) {
  if (!amount || !usd) return '';
  const value = parseFloat(formatUnits(amount, decimals)) * usd;

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function tokenValue(amount: bigint, decimals: number, symbol: string) {
  const value = parseFloat(formatUnits(amount ?? 0n, decimals));
  if (!value) return '';
  if (value < 0.0001) return `< 0.0001 ${symbol}`;

  return `${value.toFixed(3)} ${symbol}`;
}

export function TokenInput({
  isValid,
  label,
  amount,
  setAmount,
  readonly,
  token,
}: Props) {
  return (
    <fieldset className={styles.container}>
      <span className={styles.title}>{label}</span>

      <label className={clsx(styles.wrapper, { invalid: !isValid })}>
        <BigIntInput
          amount={amount}
          decimals={token.decimals}
          readOnly={readonly}
          onAmount={setAmount}
          className={styles.input}
        />
        <span className={styles.chip}>
          <img src={token.icon} alt={token.symbol} />
          {token.symbol}
        </span>
      </label>

      <output className="flex justify-between">
        <span>{value(amount, token.usd)}</span>
        <span>
          {tokenValue(token.balance ?? 0n, token.decimals, token.symbol)}
        </span>
      </output>
    </fieldset>
  );
}
