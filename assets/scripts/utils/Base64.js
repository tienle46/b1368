/*global escape, unescape */
/*jslint bitwise: true, browser: true, plusplus: true */
export default class Base64 {
    constructor() {
        this.b64e = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/', '='
        ];
        this.b64d = {
            'A': 0,
            'B': 1,
            'C': 2,
            'D': 3,
            'E': 4,
            'F': 5,
            'G': 6,
            'H': 7,
            'I': 8,
            'J': 9,
            'K': 10,
            'L': 11,
            'M': 12,
            'N': 13,
            'O': 14,
            'P': 15,
            'Q': 16,
            'R': 17,
            'S': 18,
            'T': 19,
            'U': 20,
            'V': 21,
            'W': 22,
            'X': 23,
            'Y': 24,
            'Z': 25,
            'a': 26,
            'b': 27,
            'c': 28,
            'd': 29,
            'e': 30,
            'f': 31,
            'g': 32,
            'h': 33,
            'i': 34,
            'j': 35,
            'k': 36,
            'l': 37,
            'm': 38,
            'n': 39,
            'o': 40,
            'p': 41,
            'q': 42,
            'r': 43,
            's': 44,
            't': 45,
            'u': 46,
            'v': 47,
            'w': 48,
            'x': 49,
            'y': 50,
            'z': 51,
            '0': 52,
            '1': 53,
            '2': 54,
            '3': 55,
            '4': 56,
            '5': 57,
            '6': 58,
            '7': 59,
            '8': 60,
            '9': 61,
            '+': 62,
            '/': 63,
            '=': 64
        };
    }

    /**
     * @name encode
     * @function
     * @param {string} str
     * @return {string} encoded string
     * @memberOf Base64
     */
    encode(string) {
        if (window.btoa) {
            return btoa(decodeURIComponent(encodeURIComponent(string)));
        }

        // else
        let i = 0,
            j = 0,
            len, a1, a2, a3, b1, b2, b3, b4, value = [];

        string = decodeURIComponent(encodeURIComponent(string));
        len = string.length;

        while (i < len) {
            a1 = string.charCodeAt(i++) || 0;
            a2 = string.charCodeAt(i++) || 0;
            a3 = string.charCodeAt(i++) || 0;

            b1 = (a1 >> 2) & 0x3F;
            b2 = ((a1 & 0x03) << 4) | ((a2 >> 4) & 0x0F);
            b3 = ((a2 & 0x0F) << 2) | ((a3 >> 6) & 0x03);
            b4 = a3 & 0x3F;

            if (!a3) {
                b4 = 64;
                if (!a2) {
                    b3 = 64;
                }
            }
            value[j++] = this.b64e[b1];
            value[j++] = this.b64e[b2];
            value[j++] = this.b64e[b3];
            value[j++] = this.b64e[b4];
        }

        return value.join('');
    }

    /**
     * @name decode
     * @function
     * @param {string} str
     * @return {string} decoded string
     * @memberOf Base64
     */
    decode(string) {
        if (window.atob) {
            return decodeURIComponent(encodeURIComponent(atob(string)));
        }

        let i = 0,
            j = 0,
            len, b1, b2, b3, b4, a1, a2, a3, value = [];

        string = string.replace(/\=+$/, '').split('');
        len = string.length;
        while (i < len) {
            b1 = this.b64d[string[i++]] || '';
            b2 = this.b64d[string[i++]] || '';
            b3 = this.b64d[string[i++]] || '';
            b4 = this.b64d[string[i++]] || '';

            a1 = ((b1 & 0x3F) << 2) | ((b2 >> 4) & 0x03);
            a2 = ((b2 & 0x0F) << 4) | ((b3 >> 2) & 0x0F);
            a3 = ((b3 & 0x03) << 6) | (b4 & 0x3F);

            value[j++] = String.fromCharCode(a1);
            if (a2) {
                value[j++] = String.fromCharCode(a2);
                if (a3) {
                    value[j++] = String.fromCharCode(a3);
                }
            }
        }
        return decodeURIComponent(encodeURIComponent(value.join('')));
    }

    /**
     * @name encodeSafe
     * @function
     * @param {string} string
     * @return {string} encoded string (web safe)
     */
    encodeSafe(string) {
        if (string) {
            return this.encode(string).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '.');
        }
    }

    /**
     * @name decodeSafe
     * @function
     * @param {string} string
     * @return {string} decoded string (web safe)
     */
    decodeSafe(string) {
        if (string) {
            string = string.replace(/-/g, '+').replace(/_/g, '/').replace(/\./g, '=');
            return this.decode(string);
        }
    }
}