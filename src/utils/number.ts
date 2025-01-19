export function isNumber(input: string, sign: boolean) {
    let period = false;
    let i = sign && (input[0] === '-' || input[0] === '+') ? 1 : 0;
    while (i < input.length) {
        const code = input.charCodeAt(i++);
        if (!period && (period = code === 46 || code == 44)) continue;
        if (code < 48 || code > 57) return false;
    }
    return true;
}

export function trimEnd(input: string, char: string) {
	let i = input.length;
	while (input[--i] === char);
	return input.substring(0, i + 1);
}

export type FormatDecimalOptions = {
	unit?: number;
	compact?: bigint;
	minimumFractionDigits?: BigIntToLocaleStringOptions['minimumFractionDigits'];
	maximumFractionDigits?: BigIntToLocaleStringOptions['maximumFractionDigits'];
};

export function formatDecimal(input: bigint, options: FormatDecimalOptions = {}): string {
    const unit = options.unit ?? 18;
    if (!Number.isInteger(unit) || unit < 0 || unit > 256) throw new Error('Invalid unit');
    const multiplier = 10n ** BigInt(unit);

    input = BigInt(input);
    const isNegative = input < 0n;
    if (isNegative) input = -input;

    const whole = (input / multiplier) * (isNegative ? -1n : 1n);

    if (options.compact && whole > options.compact) {
        return whole.toLocaleString('en-US', { notation: 'compact' });
    }

    let fraction = (input % multiplier).toString().padStart(unit, '0');
    const max = options.maximumFractionDigits ?? 5;

    // Handle very small numbers
    if (whole === 0n && fraction !== '0') {
        // Count leading zeros
        const leadingZeros = fraction.match(/^0*/)?.[0].length ?? 0;
        
        if (leadingZeros > max) {
            // Get significant digits after leading zeros
            const significant = fraction.slice(leadingZeros, leadingZeros + max);
            return `0.0...${significant}`;
        }
    }

    // Regular number formatting
    if (max) fraction = fraction.substring(0, max);
    fraction = trimEnd(fraction, '0');
    if (options.minimumFractionDigits) {
        fraction = fraction.padEnd(options.minimumFractionDigits, '0');
    }

    return fraction.length ? `${whole}.${fraction}` : `${whole}`;
}

interface FormatOptions {
    unit?: number;
    compact?: bigint;
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
}
