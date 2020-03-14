import { Base64UrlTransformer } from '../interfaces/base64UrlTransformer';
import { BinaryConverter } from '../interfaces/binaryConverter';
import { DefaultBase64UrlTransformer } from '../transformers/defaultBase64UrlTransformer';

enum BinaryConverterErrorCodes {
    BASE64_DECODE_ERROR = 'Base64 decode error',
    HEX_DECODE_ERROR = 'Hex decode error',
}

export class DefaultBinaryConverter implements BinaryConverter {
    private static readonly ERROR_CODES = BinaryConverterErrorCodes;

    public constructor(
        private readonly base64UrlTransformer: Base64UrlTransformer = new DefaultBase64UrlTransformer(),
    ) {}

    /**
     * Encodes a binary representation into a hexadecimal string.
     * Does not throw.
     */
    public encodeToHex(bytes: Uint8Array): string {
        let hex = '';
        for (const b of bytes) {
            hex += b.toString(16).padStart(2, '0');
        }
        return hex;
    }

    /**
     * Decodes a hexadecimal string into a binary representation.
     * Throws if decoding is unsuccessful.
     */
    public decodeFromHex(hex: string): Uint8Array {
        if (!/^[a-f0-9]*$/iu.test(hex)) {
            throw new Error(DefaultBinaryConverter.ERROR_CODES.HEX_DECODE_ERROR);
        }
        const paddedHex = hex.length % 2 === 1 ? `0${hex}` : hex;
        const paddedHexLength = paddedHex.length;
        const bytes = new Uint8Array(paddedHexLength / 2);
        for (let hi = 0, bi = 0; hi < paddedHexLength; hi += 2, bi++) {
            const doubleHexChar = paddedHex.substring(hi, hi + 2);
            bytes[bi] = parseInt(doubleHexChar, 16);
        }
        return bytes;
    }

    /**
     * Encodes a binary representation into Base64 format.
     * Does not throw.
     */
    public encodeToBase64(bytes: Uint8Array): string {
        const asBinaryString = String.fromCharCode(...bytes);
        return btoa(asBinaryString);
    }

    /**
     * Decodes a Base64-encoded binary representation.
     * Throws if decoding is unsuccessful.
     */
    public decodeFromBase64(base64: string): Uint8Array {
        try {
            const asBinaryString = atob(base64);
            return Uint8Array.from(asBinaryString, (_, i) => asBinaryString.charCodeAt(i));
        } catch (e) {
            throw new Error(DefaultBinaryConverter.ERROR_CODES.BASE64_DECODE_ERROR);
        }
    }

    /**
     * Encodes a binary representation into (URL- and filename-safe) Base64URL format.
     */
    public encodeToBase64Url(bytes: Uint8Array): string {
        const asBase64 = this.encodeToBase64(bytes);
        return this.base64UrlTransformer.transformBase64ToBase64Url(asBase64);
    }

    /**
     * Decodes a (URL- and filename-safe) Base64URL-encoded binary representation.
     */
    public decodeFromBase64Url(base64Url: string): Uint8Array {
        const asBase64 = this.base64UrlTransformer.transformBase64UrlToBase64(base64Url);
        return this.decodeFromBase64(asBase64);
    }
}
