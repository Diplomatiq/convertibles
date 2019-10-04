export interface BinaryConverter {
    encodeToHex(bytes: Uint8Array): string;
    decodeFromHex(hex: string): Uint8Array;
    encodeToBase64(bytes: Uint8Array): string;
    decodeFromBase64(base64: string): Uint8Array;
    encodeToBase64Url(bytes: Uint8Array): string;
    decodeFromBase64Url(base64Url: string): Uint8Array;
}
