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