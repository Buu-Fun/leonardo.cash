import './bigint-input';

import { useCallback, useEffect, useRef } from 'react';

interface BigIntInputProps {
  amount?: string | number | bigint;
  decimals?: number;
  readOnly?: boolean;
  className?: string;
  onAmount?: (amount: bigint) => void;
}

export const BigIntInput = ({
  amount,
  decimals,
  readOnly,
  className,
  onAmount,
  ...props
}: BigIntInputProps) => {
  const input = useRef<HTMLInputElement>(null);

  const handler = useCallback(
    (e: CustomEvent<{ amount: bigint }>) => onAmount?.(e.detail.amount),
    [onAmount],
  );

  useEffect(() => {
    const current = input.current;
    if (!current) return;

    if (amount !== undefined) current.setAttribute('amount', amount.toString());
    if (decimals !== undefined)
      current.setAttribute('decimals', decimals.toString());

    current.addEventListener('amount', handler);

    return () => current.removeEventListener('amount', handler);
  }, [amount, decimals, handler]);

  return (
    <input
      ref={input}
      is="bigint-input"
      readOnly={readOnly}
      className={className}
      {...props}
    />
  );
};
