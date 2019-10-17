import { Base64UrlTransformer } from '../interfaces/base64UrlTransformer';

export class DefaultBase64UrlTransformer implements Base64UrlTransformer {
    /**
     * Transforms a Base64 representation to Base64URL.
     * Symmetric to @member transformBase64UrlToBase64.
     */
    public transformBase64ToBase64Url(base64: string): string {
        return base64
            .replace(/\+/gu, '-')
            .replace(/\//gu, '_')
            .replace(/[=]/gu, '');
    }

    /**
     * Transforms a Base64URL representation to Base64.
     * Symmetric to @member transformBase64ToBase64Url.
     */
    public transformBase64UrlToBase64(base64Url: string): string {
        const notPadded = base64Url.replace(/-/gu, '+').replace(/_/gu, '/');

        let padding = '';
        switch (notPadded.length % 4) {
            case 2:
                padding = '==';
                break;

            case 3:
                padding = '=';
                break;
        }

        return notPadded.concat(padding);
    }
}
