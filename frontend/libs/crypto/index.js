import { FindDayofMonth, FindDayofYear, getRandPrime, isPrime } from '@ais/utils';
import bigInt from 'big-integer';
import { HmacSHA256, SHA256, enc } from 'crypto-js';

export const hash = (str) => {
    // return crypto.createHash("sha256").update(str).digest("hex");

    return SHA256(str).toString();
};

export async function convertHASHData(str) {
    // Encode the string into bytes
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(str);

    // Perform the SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);

    // Convert the result to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    return hashHex.toUpperCase();
}

export async function decrypt(stringToDecrypt, sk1, salt) {
    const secretKey = await convertHASHData(sk1);
    const iv = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const ivspec = new Uint8Array(iv);

    //  const factory = crypto.subtle;
    const spec = {
        name: 'PBKDF2',
        salt: new TextEncoder().encode(salt),
        iterations: 65536,
        hash: 'SHA-256',
    };
    const sk = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secretKey),
        { name: 'PBKDF2' },
        false,
        ['deriveKey'],
    );
    const derivedKey = await crypto.subtle.deriveKey(
        spec,
        sk,
        { name: 'AES-CBC', length: 256 },
        false,
        ['encrypt', 'decrypt'],
    );

    const encryptedData = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: ivspec },
        derivedKey,
        Uint8Array.from(atob(stringToDecrypt), (c) => c.charCodeAt(0)),
    );
    return new TextDecoder().decode(encryptedData);
}

export async function encrypt(stringToEncrypt, sk2, salt) {
    const secretKey = await convertHASHData(sk2);

    const iv = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const ivspec = new Uint8Array(iv);

    //const factory = crypto.subtle;
    const spec = {
        name: 'PBKDF2',
        salt: new TextEncoder().encode(salt),
        iterations: 65536,
        hash: 'SHA-256',
    };
    const sk = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secretKey),
        { name: 'PBKDF2' },
        false,
        ['deriveKey'],
    );
    const derivedKey = await crypto.subtle.deriveKey(
        spec,
        sk,
        { name: 'AES-CBC', length: 256 },
        false,
        ['encrypt', 'decrypt'],
    );
    const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: ivspec },
        derivedKey,
        new TextEncoder().encode(stringToEncrypt),
    );
    return btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedData)));
}

export const generateSnowFlakeID = (px) => {
    const uuid = crypto.randomUUID();
    const p = ('000000' + px).slice(-5);
    const salt = uuid.split('-').pop();
    return [stringToHex(p) + '-' + uuid, salt, p];
};

export const decodeSnowFlakeID = (uuid) => {
    const salt = uuid.split('-').pop();
    const Tp = uuid.split('-')[0].toString();
    const p = hex2a(Tp);
    return [p.replace(/^0+/, ''), salt];
};

export const GenerateSecretKey = (P = 0) => {
    const p = P === 0 ? bigInt(getRandPrime(10, 1000)) : bigInt(P);
    const g = bigInt(findPrimitive(p));

    const a = bigInt(FindDayofMonth());
    const b = bigInt(FindDayofYear()); // b for backend

    const x = g.modPow(a, p);
    //  const y = g.modPow(b, p);
    const ka = x.modPow(b, p);
    //  const kb = y.modPow(a, p);

    return [p.toJSNumber(), g.toJSNumber(), ka.toJSNumber()];
};

function findPrimitive(n) {
    let s = new Set();

    if (!isPrime(n)) {
        return -1;
    }

    let phi = n - 1;

    findPrimefactors(s, phi);

    for (let r = 2; r <= phi; r++) {
        let flag = false;
        for (let a of s) {
            if (power(r, Math.floor(phi / a), n) === 1) {
                flag = true;
                break;
            }
        }

        if (!flag) {
            return r;
        }
    }

    return -1;
}

function findPrimefactors(s, n) {
    while (n % 2 === 0) {
        s.add(2);
        n = n / 2;
    }

    for (let i = 3; i <= Math.sqrt(n); i = i + 2) {
        while (n % i === 0) {
            s.add(i);
            n = n / i;
        }
    }

    if (n > 2) {
        s.add(n);
    }
}

function power(x, y, p) {
    let res = 1;
    x = x % p;

    while (y > 0) {
        if (y % 2 === 1) {
            res = (res * x) % p;
        }

        y = y >> 1;
        x = (x * x) % p;
    }

    return res;
}

const stringToHex = (str) => {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        const hexValue = charCode.toString(16);

        // Pad with zeros to ensure two-digit representation
        hex += hexValue.padStart(2, '0');
    }
    return hex;
};

const hex2a = (hexx) => {
    var str = '';
    for (var i = 0; i < hexx.length; i += 2) {
        var v = parseInt(hexx.substr(i, 2), 16);
        if (v) str += String.fromCharCode(v);
    }
    return str;
};

export async function generateHmac(str, secretKey) {
    const Tkey = await convertHASHData(secretKey);
    const key = enc.Utf8.parse(Tkey);
    var hash = HmacSHA256(str.toString(), key);
    var hashInBase64 = enc.Base64.stringify(hash);

    return hashInBase64;
}
