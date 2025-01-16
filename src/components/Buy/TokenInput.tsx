import { formatUnits } from 'viem';
import BigIntInput from './BigIntInput';
import styles from './tokeninput.module.css';

interface Props {
    label: string;
    amount: bigint;
    setAmount: (amount: bigint) => void;
    token: {
        symbol: string;
        icon: string;
        decimals: number;
        usd?: bigint;
        balance?: bigint;
    }
}
export function TokenInput({ label, amount, setAmount, token }: Props) {
    return <fieldset className={styles.container}>
        <span className={styles.title}>{label}</span>

        <label className={styles.wrapper}>
            <BigIntInput className={styles.input} amount={amount} setAmount={setAmount} decimals={token.decimals} />
            <span className={styles.chip}>
                <img src={token.icon} alt={token.symbol} />
                {token.symbol}
            </span>
        </label>

        <output className='flex justify-between'>
            <span>${formatUnits(amount ?? 0n, token.decimals)}</span>
            <span>{formatUnits(token.balance ?? 0n, token.decimals)}{token.symbol}</span>
        </output>
    </fieldset>
}