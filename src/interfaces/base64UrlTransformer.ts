export interface Base64UrlTransformer {
    transformBase64ToBase64Url(base64: string): string;
    transformBase64UrlToBase64(base64Url: string): string;
}
