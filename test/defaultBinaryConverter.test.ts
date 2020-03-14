import { expect } from 'chai';
import { DefaultBinaryConverter } from '../src/converters/defaultBinaryConverter';

const defaultBinaryConverterInstance = new DefaultBinaryConverter();

const testVector = {
    bytes: Uint8Array.from([
        0,
        56,
        47,
        243,
        153,
        145,
        7,
        169,
        136,
        165,
        188,
        112,
        15,
        111,
        18,
        249,
        58,
        240,
        158,
        39,
        151,
        248,
        115,
        93,
        4,
        109,
        229,
        170,
        90,
        179,
        254,
        253,
        254,
        255,
        255,
    ]),
    hex: '00382ff3999107a988a5bc700f6f12f93af09e2797f8735d046de5aa5ab3fefdfeffff',
    base64: 'ADgv85mRB6mIpbxwD28S+TrwnieX+HNdBG3lqlqz/v3+//8=',
    base64url: 'ADgv85mRB6mIpbxwD28S-TrwnieX-HNdBG3lqlqz_v3-__8',
};

describe('DefaultBinaryConverter', () => {
    before(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.btoa = (string: string): string => {
            for (let i = 0; i < string.length; i++) {
                if (string.charCodeAt(i) > 255) {
                    throw new Error();
                }
            }
            return Buffer.from(string, 'binary').toString('base64');
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.atob = (base64: string): string => {
            if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(base64)) {
                throw new Error();
            }
            return Buffer.from(base64, 'base64').toString('binary');
        };
    });

    after(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.atob = undefined;

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        global.btoa = undefined;
    });

    describe('encodeToHex', () => {
        it('should correctly encode a binary representation', () => {
            const hex = defaultBinaryConverterInstance.encodeToHex(testVector.bytes);
            const expected = testVector.hex;
            expect(hex).to.equal(expected);
        });
    });

    describe('decodeFromHex', () => {
        it('should correctly decode a binary representation', () => {
            const bytes = defaultBinaryConverterInstance.decodeFromHex(testVector.hex);
            const expected = testVector.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should correctly decode a binary representation from an unpadded hex', () => {
            const bytes = defaultBinaryConverterInstance.decodeFromHex(testVector.hex.substring(1));
            const expected = testVector.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should throw error on invalid hexadecimal strings', () => {
            try {
                defaultBinaryConverterInstance.decodeFromHex('0x');
            } catch (e) {
                expect(e.message).to.equal('Hex decode error');
            }
        });
    });

    describe('encodeToBase64', () => {
        it('should correctly encode a binary representation', () => {
            const base64 = defaultBinaryConverterInstance.encodeToBase64(testVector.bytes);
            const expected = testVector.base64;
            expect(base64).to.equal(expected);
        });
    });

    describe('decodeFromBase64', () => {
        it('should correctly decode a binary representation', () => {
            const bytes = defaultBinaryConverterInstance.decodeFromBase64(testVector.base64);
            const expected = testVector.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should throw error on invalid Base64 strings', () => {
            try {
                defaultBinaryConverterInstance.decodeFromBase64('ŐO1wbPZt4XRpcSBpcyBjb/xsLg==');
                expect.fail('did not throw');
            } catch (e) {
                expect(e.message).to.be.equal('Base64 decode error');
            }
        });

        it('should throw error on Base64 strings with invalid padding', () => {
            try {
                defaultBinaryConverterInstance.decodeFromBase64('RO1wbPZt4XRpcSBpcyBjb/xsLg=');
                expect.fail('did not throw');
            } catch (e) {
                expect(e.message).to.be.equal('Base64 decode error');
            }

            try {
                defaultBinaryConverterInstance.decodeFromBase64('RO1wbPZt4XRpcSBpcyBjb/xsLg');
                expect.fail('did not throw');
            } catch (e) {
                expect(e.message).to.be.equal('Base64 decode error');
            }
        });
    });

    describe('encodeToBase64Url', () => {
        it('should correctly encode a binary representation', () => {
            const base64url = defaultBinaryConverterInstance.encodeToBase64Url(testVector.bytes);
            const expected = testVector.base64url;
            expect(base64url).to.equal(expected);
        });
    });

    describe('decodeFromBase64Url', () => {
        it('should correctly decode a binary representation', () => {
            const bytes = defaultBinaryConverterInstance.decodeFromBase64Url(testVector.base64url);
            const expected = testVector.bytes;
            expect(bytes).to.deep.equal(expected);
        });
    });
});
