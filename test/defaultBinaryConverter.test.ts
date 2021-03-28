import { expect } from 'chai';
import { DefaultBinaryConverter } from '../src/converters/defaultBinaryConverter';

const defaultBinaryConverterInstance = new DefaultBinaryConverter();

const testVectors = {
    default: {
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
    },
    empty: {
        bytes: Uint8Array.from([]),
        hex: '',
        base64: '',
        base64url: '',
    },
};

describe('DefaultBinaryConverter', (): void => {
    before((): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.btoa = (string: string): string => {
            for (let i = 0; i < string.length; i++) {
                if (string.charCodeAt(i) > 255) {
                    throw new Error();
                }
            }
            return Buffer.from(string, 'binary').toString('base64');
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.atob = (base64: string): string => {
            if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(base64)) {
                throw new Error();
            }
            return Buffer.from(base64, 'base64').toString('binary');
        };
    });

    after((): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.atob = undefined;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.btoa = undefined;
    });

    describe('encodeToHex', (): void => {
        it('should correctly encode a binary representation', (): void => {
            const hex = defaultBinaryConverterInstance.encodeToHex(testVectors.default.bytes);
            const expected = testVectors.default.hex;
            expect(hex).to.equal(expected);
        });

        it('should correctly encode an empty binary representation', (): void => {
            const hex = defaultBinaryConverterInstance.encodeToHex(testVectors.empty.bytes);
            const expected = testVectors.empty.hex;
            expect(hex).to.equal(expected);
        });
    });

    describe('decodeFromHex', (): void => {
        it('should correctly decode a binary representation', (): void => {
            const bytes = defaultBinaryConverterInstance.decodeFromHex(testVectors.default.hex);
            const expected = testVectors.default.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should correctly decode a binary representation from an unpadded hex', (): void => {
            const bytes = defaultBinaryConverterInstance.decodeFromHex(testVectors.default.hex.substring(1));
            const expected = testVectors.default.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should correctly decode a binary representation from an empty hex', (): void => {
            const bytes = defaultBinaryConverterInstance.decodeFromHex(testVectors.empty.hex);
            const expected = testVectors.empty.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should throw error on invalid hexadecimal strings', (): void => {
            try {
                defaultBinaryConverterInstance.decodeFromHex('0x');
            } catch (e) {
                if (e instanceof Error) {
                    expect(e.message).to.equal('Hex decode error');
                } else {
                    expect.fail('exception is not of Error type');
                }
            }
        });
    });

    describe('encodeToBase64', (): void => {
        it('should correctly encode a binary representation', (): void => {
            const base64 = defaultBinaryConverterInstance.encodeToBase64(testVectors.default.bytes);
            const expected = testVectors.default.base64;
            expect(base64).to.equal(expected);
        });

        it('should correctly encode an empty binary representation', (): void => {
            const base64 = defaultBinaryConverterInstance.encodeToBase64(testVectors.empty.bytes);
            const expected = testVectors.empty.base64;
            expect(base64).to.equal(expected);
        });
    });

    describe('decodeFromBase64', (): void => {
        it('should correctly decode a binary representation', (): void => {
            const bytes = defaultBinaryConverterInstance.decodeFromBase64(testVectors.default.base64);
            const expected = testVectors.default.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should correctly decode an empty binary representation', (): void => {
            const bytes = defaultBinaryConverterInstance.decodeFromBase64(testVectors.empty.base64);
            const expected = testVectors.empty.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should throw error on invalid Base64 strings', (): void => {
            try {
                defaultBinaryConverterInstance.decodeFromBase64('ŐO1wbPZt4XRpcSBpcyBjb/xsLg==');
                expect.fail('did not throw');
            } catch (e) {
                if (e instanceof Error) {
                    expect(e.message).to.be.equal('Base64 decode error');
                } else {
                    expect.fail('exception is not of Error type');
                }
            }
        });

        it('should throw error on Base64 strings with invalid padding', (): void => {
            try {
                defaultBinaryConverterInstance.decodeFromBase64('RO1wbPZt4XRpcSBpcyBjb/xsLg=');
                expect.fail('did not throw');
            } catch (e) {
                if (e instanceof Error) {
                    expect(e.message).to.be.equal('Base64 decode error');
                } else {
                    expect.fail('exception is not of Error type');
                }
            }

            try {
                defaultBinaryConverterInstance.decodeFromBase64('RO1wbPZt4XRpcSBpcyBjb/xsLg');
                expect.fail('did not throw');
            } catch (e) {
                if (e instanceof Error) {
                    expect(e.message).to.be.equal('Base64 decode error');
                } else {
                    expect.fail('exception is not of Error type');
                }
            }
        });
    });

    describe('encodeToBase64Url', (): void => {
        it('should correctly encode a binary representation', (): void => {
            const base64url = defaultBinaryConverterInstance.encodeToBase64Url(testVectors.default.bytes);
            const expected = testVectors.default.base64url;
            expect(base64url).to.equal(expected);
        });

        it('should correctly encode an empty binary representation', (): void => {
            const base64url = defaultBinaryConverterInstance.encodeToBase64Url(testVectors.empty.bytes);
            const expected = testVectors.empty.base64url;
            expect(base64url).to.equal(expected);
        });
    });

    describe('decodeFromBase64Url', (): void => {
        it('should correctly decode a binary representation', (): void => {
            const bytes = defaultBinaryConverterInstance.decodeFromBase64Url(testVectors.default.base64url);
            const expected = testVectors.default.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should correctly decode an empty binary representation', (): void => {
            const bytes = defaultBinaryConverterInstance.decodeFromBase64Url(testVectors.empty.base64url);
            const expected = testVectors.empty.bytes;
            expect(bytes).to.deep.equal(expected);
        });
    });
});
