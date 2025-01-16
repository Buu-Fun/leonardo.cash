import React, { useState, useEffect, useRef } from 'react';
import { isNumber } from '@/src/utils/number';
import { formatUnits, parseUnits } from 'viem';
interface Props {
    amount: bigint;
    setAmount: (amount: bigint) => void;
    decimals?: number;
    readonly?: boolean;
    autoFocus?: boolean;
    className?: string;
}
function BigIntInput({ className, amount, setAmount, decimals = 18, readonly, autoFocus }: Props) {
    const [value, setValue] = useState('');

    useEffect(() => {
        if (parseUnits(value ?? '0', decimals) === (amount ?? 0n)) return;
        if (amount !== undefined) setValue(formatUnits(amount, decimals));
    }, [amount, value, decimals]);

    function onUpdate(event: React.ChangeEvent<HTMLInputElement>) {
        if (value === event.currentTarget.value) return;
        if (!isNumber(event.currentTarget.value, false)) return;
        try {
            setValue(event.currentTarget.value);
            setAmount(parseUnits(event.currentTarget.value, decimals));
        } catch {
            setAmount(0n);
        }
    };

    function validate(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key.length > 1) return;
        const current = event.currentTarget.value;
        const start = current.substring(0, event.currentTarget.selectionStart ?? 0);
        const end = current.substring(event.currentTarget.selectionEnd ?? 0, current.length);
        const future = start + event.key + end;
        if (!isNumber(future, false)) return event.preventDefault();
    };

    function onArrow(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        event.preventDefault();
        const number = parseFloat(event.currentTarget.value);
        const current = isNaN(number) ? 0 : number;
        const direction = event.key === 'ArrowUp' ? 1 : -1;
        const modifier = event.metaKey || event.ctrlKey ? 100 : event.shiftKey ? 10 : event.altKey ? 0.1 : 1;
        const fraction = current.toString().split('.')[1] ?? '';
        const decimals = Math.max(fraction.length, event.altKey ? 1 : 0);

        const newValue = current + direction * modifier;
        event.currentTarget.value = Math.max(newValue, 0).toFixed(decimals);
    };

    const formInput = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (autoFocus) formInput.current?.focus();
    }, [autoFocus]);

    return (
        <>
            <input
                className={className}
                ref={formInput}
                value={value}
                readOnly={readonly}
                autoFocus={autoFocus}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder="0.0"
                minLength={1}
                maxLength={79}
                min="0"
                onKeyDown={onArrow}
                onKeyPress={validate}
                onChange={onUpdate}
            />
        </>
    );
};

export default BigIntInput;
