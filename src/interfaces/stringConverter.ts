export interface StringConverter {
    encodeToBytes(string: string): Uint8Array;
    decodeFromBytes(bytes: Uint8Array): string;
    encodeToBase64(string: string): string;
    decodeFromBase64(base64: string): string;
    encodeToBase64Url(string: string): string;
    decodeFromBase64Url(base64url: string): string;
}
