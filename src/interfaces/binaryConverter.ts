export interface BinaryConverter {
    encodeToBase64(bytes: Uint8Array): string;
    decodeFromBase64(base64: string): Uint8Array;
}
