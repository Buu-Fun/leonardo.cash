type AmountEventDetail = {
  amount: bigint;
};

declare global {
  interface HTMLElementEventMap {
    amount: CustomEvent<AmountEventDetail>;
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace JSX {
  interface IntrinsicElements {
    'bigint-input': {
      amount: string | bigint | number;
      decimal: number | string;
    };
  }
}

type BigIntish = string | number | bigint;

export function format(input: BigIntish, unit = 18) {
  if (!Number.isInteger(unit) || unit < 0) throw new Error('Invalid unit');
  const multiplier = 10n ** BigInt(unit);
  input = BigInt(input);
  const isNegative = input < 0n;
  if (isNegative) input = -input;
  const whole = (input / multiplier) * (isNegative ? -1n : 1n);
  let fraction = (input % multiplier).toString().padStart(unit, '0');
  fraction = trimEnd(fraction, '0');
  return fraction.length ? `${whole}.${fraction}` : `${whole}`;
}

export function parse(input: string, unit = 18) {
  if (!isNumber(input)) return 0n;
  const isNegative = input.startsWith('-');
  if (isNegative || input.startsWith('+')) input = input.substring(1);
  if (!Number.isInteger(unit) || unit < 0) return 0n;
  const multiplier = 10n ** BigInt(unit);
  const components = input.replace(',', '.').split('.');
  let fraction = components[1] || '0';
  fraction = fraction.substring(0, unit).padEnd(unit, '0');
  const output = BigInt(components[0] || '0') * multiplier + BigInt(fraction);
  return isNegative ? -output : output;
}

export function trimEnd(input: string, char: string) {
  let i = input.length;
  while (input[--i] === char);
  return input.substring(0, i + 1);
}

export function isNumber(input: string, sign = true) {
  let period = false;
  let i = sign && (input[0] === '-' || input[0] === '+') ? 1 : 0;
  while (i < input.length) {
    const code = input.charCodeAt(i++);
    if (!period && (period = code === 46 || code == 44)) continue;
    if (code < 48 || code > 57) return false;
  }
  return true;
}

export default class BigIntInput extends HTMLInputElement {
  #amount: bigint = 0n;
  #decimals: number = 18;

  constructor() {
    super();
    this.type = 'text';
    this.inputMode = 'decimal';
    this.autocomplete = 'off';
    this.autocapitalize = 'off';
    this.spellcheck = false;

    //@ts-expect-error TODO: Fix this
    this.autocorrect = 'off';
    this.pattern = '^[0-9]*[.,]?[0-9]*$';
    this.placeholder = '0.0';
    this.minLength = 1;
    this.maxLength = 79;

    this.addEventListener('keydown', this.#onArrow.bind(this));
    this.addEventListener('keypress', this.#validate.bind(this));
    this.addEventListener('input', this.#onUpdate.bind(this));
  }

  static get observedAttributes(): string[] {
    return ['amount', 'decimals', 'readonly', 'autofocus'];
  }

  get amount(): bigint {
    return this.#amount;
  }

  set amount(value: string | number | bigint) {
    this.#amount = BigInt(value);
    this.#update();
  }

  get decimals(): number {
    return this.#decimals;
  }

  set decimals(value: string | number) {
    this.#decimals = parseInt(String(value)) || 18;
    this.#update();
  }

  #update() {
    if (!this.#amount) return;
    const value = format(this.#amount, this.#decimals);
    if (this.value === value) return;
    this.value = value;
  }

  #onUpdate(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!isNumber(target.value)) return;
    const amount = parse(target.value, this.#decimals);
    if (this.#amount === amount) return;
    this.#amount = amount;
    this.dispatchEvent(
      new CustomEvent<AmountEventDetail>('amount', {
        detail: { amount },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #validate(event: KeyboardEvent): void {
    if (event.key.length > 1) return;
    const target = event.target as HTMLInputElement;
    const current = target.value;
    const start = current.substring(0, target.selectionStart ?? 0);
    const end = current.substring(target.selectionEnd ?? 0, current.length);
    const future = start + event.key + end;
    if (!isNumber(future)) event.preventDefault();
  }

  #onArrow(event: KeyboardEvent): void {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();

    const target = event.target as HTMLInputElement;
    const number = parseFloat(target.value);
    const current = isNaN(number) ? 0 : number;
    const direction = event.key === 'ArrowUp' ? 1 : -1;
    const modifier =
      event.metaKey || event.ctrlKey
        ? 100
        : event.shiftKey
          ? 10
          : event.altKey
            ? 0.1
            : 1;
    const fraction = current.toString().split('.')[1] ?? '';
    const decimals = Math.max(fraction.length, event.altKey ? 1 : 0);
    this.value = Math.max(current + direction * modifier, 0).toFixed(decimals);
    const input = new Event('input', { bubbles: true, composed: true });
    this.dispatchEvent(input);
  }

  attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null,
  ) {
    switch (name) {
      case 'amount':
        if (value !== null) this.amount = value;
        break;
      case 'decimals':
        if (value !== null) this.decimals = value;
        break;
      case 'readonly':
        // this.readOnly = value !== null;
        break;
      case 'autofocus':
        this.autofocus = value !== null;
        break;
    }
  }
}

if (typeof window !== 'undefined' && !customElements.get('bigint-input')) {
  customElements.define('bigint-input', BigIntInput, { extends: 'input' });
}
