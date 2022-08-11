import { LP_TOKENS } from "../config/LP_tokens";
import { TOKENS } from "../config/token";

export const getErrorMessage = (error) => {
    if (error.code === 'INVALID_ARGUMENT') {
        return "The number is invalid, maybe too big?";
    }
    if (error.code === 'NETWORK_ERROR') {
        return "You are not on the BSC main net. Please switch to the main net.";
    }
    if (error.code === 'CALL_EXCEPTION') {
        if (error.reason === 'TiFiLibrary: IDENTICAL_ADDRESSES') {
            return "You have selected the same tokens, please select a different token.";
        }
        return "The pair doesn't exist, please select another pair.";
    }
    if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        return "Not enough balance for the transaction.";
    }
    if (error.code === 4001) {
        return "Transaction rejected by user.";
    }
    if (error.code === -32603) {
        return "Insufficient balance to perform this transaction."
    }
    return null;
}

export const toFixed = (x, precision = 6) => {
    x = x.toPrecision(precision);
    if (Math.abs(x) < 1.0) {
        let e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2, 8);
        }
    } else {
        let s = x.toString().split('+');
        let e = parseInt(s[1]);
        if (e > 0) {
            let d = s[0].split('.');
            x = (d[0] + d[1]).slice(0, -1) + '0'.repeat(e + 1 - d[1].length)
        }
    }
    if (x.indexOf('.') >= 0) {
        while ((x.slice(-1) === '0' || x.slice(-1) === '.') && x.indexOf('.') !== -1) {
            x = x.substr(0, x.length - 1);
        }
    }
    return x;
}

// Encode by Sorting Token Name
export const encodePair = (t1, t2) => {
    return t1 > t2 ? t2 + '|' + t1 : t1 + '|' + t2;
}

// Existing Pairs
export const encodedPairs = new Set(LP_TOKENS.map(p => encodePair(p.token0_name, p.token1_name)));

// Token symbol - address map
export const tokenMap = new Map(TOKENS.map(t => [t.title, t.address]));

// Get token path
export const getTokenPath = (t1, t2) => {
    if (encodedPairs.has(encodePair(t1, t2))) {
        return [t1, t2];
    }
    // Doesn't have direct pair
    if (encodedPairs.has(encodePair('BNB', t1)) && encodedPairs.has(encodePair('BNB', t2))) {
        return [t1, 'BNB', t2];
    }
    // No path found
    return [];
}

// Process big numbers, e.g. from unit wei
export const processBigNumber = (n) => {
    if (Number(n) <= 1) {
        return 0;
    }
    return parseFloat(n / 10 ** 18).toFixed(16);
}

// Extend to big number, e.g. to unit wei
export const extendToBigNumber = (n) => {
    if (Number(n) < 100) {
        return (Number(n) * 10 ** 18).toString();
    }
    return parseInt(n).toString() + "000000000000000000";
}

export const getPriceImpact = (p0, p1, unitPrice) => {
    return 100 * (Math.abs((p0 / p1) / unitPrice - 1));
}

export const getTokenPriceUsingAmount = (r0, r1, amount) => {
    let _amount = amount * 9980;
    return _amount * r1 / (r0 * 10000 + _amount);
}

export const calculatePriceImpact = (pi1, pi2, highImpact) => {
    let mathFunction = highImpact ? Math.max : Math.min;
    return toFixed(100 * (mathFunction(Math.abs(pi1 - 1), Math.abs(pi2 - 1))));
}

export const getSwapPath = (token0, token1) => {
    return getTokenPath(token0.title, token1.title).map(item => tokenMap.get(item));
}