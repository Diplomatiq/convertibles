import { Base64UrlTransformer } from '../interfaces/base64UrlTransformer';
import { BinaryConverter } from '../interfaces/binaryConverter';
import { StringConverter } from '../interfaces/stringConverter';
import { Utf8Decoder } from '../interfaces/utf8Decoder';
import { Utf8Encoder } from '../interfaces/utf8Encoder';
import { DefaultBase64UrlTransformer } from '../transformers/defaultBase64UrlTransformer';
import { DefaultBinaryConverter } from './defaultBinaryConverter';

enum StringConverterErrorCodes {
    UTF8_DECODE_ERROR = 'UTF-8 decode error',
    BASE64_DECODE_ERROR = 'Base64 decode error',
}

export class DefaultStringConverter implements StringConverter {
    private static readonly ERROR_CODES = StringConverterErrorCodes;

    public constructor(
        private readonly utf8Encoder: Utf8Encoder = new TextEncoder(),
        private readonly utf8Decoder: Utf8Decoder = new TextDecoder('utf-8', { fatal: true }),
        private readonly binaryConverter: BinaryConverter = new DefaultBinaryConverter(),
        private readonly base64UrlTransformer: Base64UrlTransformer = new DefaultBase64UrlTransformer(),
    ) {}

    /**
     * Encodes a Unicode string into UTF-8 binary representation.
     * Symmetric to @member decodeFromBytes.
     * Does not throw.
     */
    public encodeToBytes(string: string): Uint8Array {
        return this.utf8Encoder.encode(string);
    }

    /**
     * Decodes the UTF-8 binary representation of a Unicode string.
     * Symmetric to @member encodeToBytes.
     * Throws if decoding is unsuccessful.
     */
    public decodeFromBytes(bytes: Uint8Array): string {
        try {
            return this.utf8Decoder.decode(bytes);
        } catch (e) {
            throw new Error(DefaultStringConverter.ERROR_CODES.UTF8_DECODE_ERROR);
        }
    }

    /**
     * Encodes a Unicode string into Base64.
     * Symmetric to @member decodeFromBase64.
     * Does not throw.
     *
     * This method is not equivalent to window.btoa, as it accepts arbitrary
     * Unicode strings as input rather than only supporting Windows-1252. The
     * Base64 string result of this method is the Base64 representation of the
     * UTF-8 binary representation of the encoded Unicode string.
     *
     * This method is not symmetric to window.atob. While window.atob is always
     * able to decode the result of this method, the result will not be equal
     * to the originally encoded string for any character set wider than
     * the original ASCII ([0x00-0x7f]).
     */
    public encodeToBase64(string: string): string {
        const asBytes = this.encodeToBytes(string);
        return this.binaryConverter.encodeToBase64(asBytes);
    }

    /**
     * Decodes a Base64-encoded Unicode string.
     * Symmetric to @member encodeToBase64.
     * Throws if decoding is unsuccessful.
     *
     * This method is not equivalent to window.atob. The string result of this
     * method is a Unicode string, decoded from the UTF-8 binary representation
     * (which was encoded as Base64) of the original string.
     *
     * This method is not symmetric to window.btoa. Since window.btoa requires
     * its input to be a binary string, effectively it can only encode
     * characters from the Windows-1252 character set. While this method is
     * always able to decode the result of window.btoa, the result will not be
     * equal to the originally encoded string for any character set wider than
     * the original ASCII ([0x00-0x7f]).
     */
    public decodeFromBase64(base64: string): string {
        try {
            const asBytes = this.binaryConverter.decodeFromBase64(base64);
            return this.decodeFromBytes(asBytes);
        } catch (e) {
            throw new Error(DefaultStringConverter.ERROR_CODES.BASE64_DECODE_ERROR);
        }
    }

    /**
     * Encodes a Unicode string into (URL- and filename-safe) Base64URL format.
     * Symmetric to @member decodeFromBase64Url.
     * Does not throw.
     */
    public encodeToBase64Url(string: string): string {
        const asBase64 = this.encodeToBase64(string);
        return this.base64UrlTransformer.transformBase64ToBase64Url(asBase64);
    }

    /**
     * Decodes a (URL- and filename-safe) Base64URL-encoded Unicode string.
     * Symmetric to @member encodeToBase64Url.
     * Throws if decoding is unsuccessful.
     */
    public decodeFromBase64Url(base64url: string): string {
        const asBase64 = this.base64UrlTransformer.transformBase64UrlToBase64(base64url);
        return this.decodeFromBase64(asBase64);
    }
}
