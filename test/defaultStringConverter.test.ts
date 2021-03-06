import { expect } from 'chai';
import { DefaultStringConverter } from '../src/converters/defaultStringConverter';

const defaultStringConverterInstance = new DefaultStringConverter();

const testVectors = {
    ascii: {
        string: 'Diplomatiq is cool.',
        bytes: Uint8Array.from([
            68,
            105,
            112,
            108,
            111,
            109,
            97,
            116,
            105,
            113,
            32,
            105,
            115,
            32,
            99,
            111,
            111,
            108,
            46,
        ]),
        base64: 'RGlwbG9tYXRpcSBpcyBjb29sLg==',
        base64url: 'RGlwbG9tYXRpcSBpcyBjb29sLg',
    },
    extendedAscii: {
        string: 'Díplómátìq îs cöól.',
        bytes: Uint8Array.from([
            68,
            195,
            173,
            112,
            108,
            195,
            179,
            109,
            195,
            161,
            116,
            195,
            172,
            113,
            32,
            195,
            174,
            115,
            32,
            99,
            195,
            182,
            195,
            179,
            108,
            46,
        ]),
        base64: 'RMOtcGzDs23DoXTDrHEgw65zIGPDtsOzbC4=',
        base64url: 'RMOtcGzDs23DoXTDrHEgw65zIGPDtsOzbC4',
    },
    unicodeNfc: {
        string: 'Dįplőmàtiq Å & Å is eﬀective.',
        bytes: Uint8Array.from([
            68,
            196,
            175,
            112,
            108,
            197,
            145,
            109,
            195,
            160,
            116,
            105,
            113,
            32,
            195,
            133,
            32,
            38,
            32,
            195,
            133,
            32,
            105,
            115,
            32,
            101,
            239,
            172,
            128,
            101,
            99,
            116,
            105,
            118,
            101,
            46,
        ]),
        base64: 'RMSvcGzFkW3DoHRpcSDDhSAmIMOFIGlzIGXvrIBlY3RpdmUu',
        base64url: 'RMSvcGzFkW3DoHRpcSDDhSAmIMOFIGlzIGXvrIBlY3RpdmUu',
    },
    unicodeNfd: {
        string: 'Dįplőmàtiq Å & Å is eﬀective.',
        bytes: Uint8Array.from([
            68,
            105,
            204,
            168,
            112,
            108,
            111,
            204,
            139,
            109,
            97,
            204,
            128,
            116,
            105,
            113,
            32,
            65,
            204,
            138,
            32,
            38,
            32,
            65,
            204,
            138,
            32,
            105,
            115,
            32,
            101,
            239,
            172,
            128,
            101,
            99,
            116,
            105,
            118,
            101,
            46,
        ]),
        base64: 'RGnMqHBsb8yLbWHMgHRpcSBBzIogJiBBzIogaXMgZe+sgGVjdGl2ZS4=',
        base64url: 'RGnMqHBsb8yLbWHMgHRpcSBBzIogJiBBzIogaXMgZe-sgGVjdGl2ZS4',
    },
    unicodeNfkc: {
        string: 'Dįplőmàtiq Å & Å is effective.',
        bytes: Uint8Array.from([
            68,
            196,
            175,
            112,
            108,
            197,
            145,
            109,
            195,
            160,
            116,
            105,
            113,
            32,
            195,
            133,
            32,
            38,
            32,
            195,
            133,
            32,
            105,
            115,
            32,
            101,
            102,
            102,
            101,
            99,
            116,
            105,
            118,
            101,
            46,
        ]),
        base64: 'RMSvcGzFkW3DoHRpcSDDhSAmIMOFIGlzIGVmZmVjdGl2ZS4=',
        base64url: 'RMSvcGzFkW3DoHRpcSDDhSAmIMOFIGlzIGVmZmVjdGl2ZS4',
    },
    unicodeNfkd: {
        string: 'Dįplőmàtiq Å & Å is effective.',
        bytes: Uint8Array.from([
            68,
            105,
            204,
            168,
            112,
            108,
            111,
            204,
            139,
            109,
            97,
            204,
            128,
            116,
            105,
            113,
            32,
            65,
            204,
            138,
            32,
            38,
            32,
            65,
            204,
            138,
            32,
            105,
            115,
            32,
            101,
            102,
            102,
            101,
            99,
            116,
            105,
            118,
            101,
            46,
        ]),
        base64: 'RGnMqHBsb8yLbWHMgHRpcSBBzIogJiBBzIogaXMgZWZmZWN0aXZlLg==',
        base64url: 'RGnMqHBsb8yLbWHMgHRpcSBBzIogJiBBzIogaXMgZWZmZWN0aXZlLg',
    },
    empty: {
        string: '',
        bytes: Uint8Array.from([]),
        base64: '',
        base64url: '',
    },
};

describe('DefaultStringConverter', (): void => {
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

    describe('encodeToBytes', (): void => {
        it('should correctly encode an ASCII string', (): void => {
            const bytes = defaultStringConverterInstance.encodeToBytes(testVectors.ascii.string);
            const expected = testVectors.ascii.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should correctly encode an extended ASCII string', (): void => {
            const bytes = defaultStringConverterInstance.encodeToBytes(testVectors.extendedAscii.string);
            const expected = testVectors.extendedAscii.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should correctly encode a Unicode string (NFC)', (): void => {
            const bytes = defaultStringConverterInstance.encodeToBytes(testVectors.unicodeNfc.string);
            const expected = testVectors.unicodeNfc.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should correctly encode a Unicode string (NFD)', (): void => {
            const bytes = defaultStringConverterInstance.encodeToBytes(testVectors.unicodeNfd.string);
            const expected = testVectors.unicodeNfd.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should correctly encode a Unicode string (NFKC)', (): void => {
            const bytes = defaultStringConverterInstance.encodeToBytes(testVectors.unicodeNfkc.string);
            const expected = testVectors.unicodeNfkc.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should correctly encode a Unicode string (NFKD)', (): void => {
            const bytes = defaultStringConverterInstance.encodeToBytes(testVectors.unicodeNfkd.string);
            const expected = testVectors.unicodeNfkd.bytes;
            expect(bytes).to.deep.equal(expected);
        });

        it('should correctly encode an empty string', (): void => {
            const bytes = defaultStringConverterInstance.encodeToBytes(testVectors.empty.string);
            const expected = testVectors.empty.bytes;
            expect(bytes).to.deep.equal(expected);
        });
    });

    describe('decodeFromBytes', (): void => {
        it('should correctly decode an ASCII string', (): void => {
            const string = defaultStringConverterInstance.decodeFromBytes(testVectors.ascii.bytes);
            const expected = testVectors.ascii.string;
            expect(string).to.equal(expected);
        });

        it('should correctly decode an extended ASCII string', (): void => {
            const string = defaultStringConverterInstance.decodeFromBytes(testVectors.extendedAscii.bytes);
            const expected = testVectors.extendedAscii.string;
            expect(string).to.equal(expected);
        });

        it('should correctly decode a Unicode string (NFC)', (): void => {
            const string = defaultStringConverterInstance.decodeFromBytes(testVectors.unicodeNfc.bytes);
            const expected = testVectors.unicodeNfc.string;
            expect(string).to.equal(expected);
        });

        it('should correctly decode a Unicode string (NFD)', (): void => {
            const string = defaultStringConverterInstance.decodeFromBytes(testVectors.unicodeNfd.bytes);
            const expected = testVectors.unicodeNfd.string;
            expect(string).to.equal(expected);
        });

        it('should correctly decode a Unicode string (NFKC)', (): void => {
            const string = defaultStringConverterInstance.decodeFromBytes(testVectors.unicodeNfkc.bytes);
            const expected = testVectors.unicodeNfkc.string;
            expect(string).to.equal(expected);
        });

        it('should correctly decode a Unicode string (NFKD)', (): void => {
            const string = defaultStringConverterInstance.decodeFromBytes(testVectors.unicodeNfkd.bytes);
            const expected = testVectors.unicodeNfkd.string;
            expect(string).to.equal(expected);
        });

        it('should correctly decode an empty string', (): void => {
            const string = defaultStringConverterInstance.decodeFromBytes(testVectors.empty.bytes);
            const expected = testVectors.empty.string;
            expect(string).to.equal(expected);
        });

        it('should throw on invalid UTF-8 data', (): void => {
            try {
                defaultStringConverterInstance.decodeFromBytes(Uint8Array.from([0xed, 0xa0, 0x80]));
                expect.fail('did not throw');
            } catch (e) {
                if (e instanceof Error) {
                    expect(e.message).to.equal('UTF-8 decode error');
                } else {
                    expect.fail('exception is not of Error type');
                }
            }
        });
    });

    describe('encodeToBase64', (): void => {
        it('should correctly encode an ASCII string', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64(testVectors.ascii.string);
            const expected = testVectors.ascii.base64;
            expect(base64).to.equal(expected);
        });

        it('should correctly encode an extended ASCII string', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64(testVectors.extendedAscii.string);
            const expected = testVectors.extendedAscii.base64;
            expect(base64).to.equal(expected);
        });

        it('should correctly encode a Unicode string (NFC)', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64(testVectors.unicodeNfc.string);
            const expected = testVectors.unicodeNfc.base64;
            expect(base64).to.equal(expected);
        });

        it('should correctly encode a Unicode string (NFD)', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64(testVectors.unicodeNfd.string);
            const expected = testVectors.unicodeNfd.base64;
            expect(base64).to.equal(expected);
        });

        it('should correctly encode a Unicode string (NFKC)', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64(testVectors.unicodeNfkc.string);
            const expected = testVectors.unicodeNfkc.base64;
            expect(base64).to.equal(expected);
        });

        it('should correctly encode a Unicode string (NFKD)', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64(testVectors.unicodeNfkd.string);
            const expected = testVectors.unicodeNfkd.base64;
            expect(base64).to.equal(expected);
        });

        it('should correctly encode an empty string', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64(testVectors.empty.string);
            const expected = testVectors.empty.base64;
            expect(base64).to.equal(expected);
        });
    });

    describe('decodeFromBase64', (): void => {
        it('should correctly decode a Base64 string encoded from an ASCII string', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64(testVectors.ascii.base64);
            const expected = testVectors.ascii.string;
            expect(string).to.equal(expected);
        });

        it('should correctly decode a Base64 string encoded from an extended ASCII string', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64(testVectors.extendedAscii.base64);
            const expected = testVectors.extendedAscii.string;
            expect(string).to.equal(expected);
        });

        it('should correctly encode a Unicode string (NFC)', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64(testVectors.unicodeNfc.base64);
            const expected = testVectors.unicodeNfc.string;
            expect(string).to.equal(expected);
        });

        it('should correctly encode a Unicode string (NFD)', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64(testVectors.unicodeNfd.base64);
            const expected = testVectors.unicodeNfd.string;
            expect(string).to.equal(expected);
        });

        it('should correctly encode a Unicode string (NFKC)', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64(testVectors.unicodeNfkc.base64);
            const expected = testVectors.unicodeNfkc.string;
            expect(string).to.equal(expected);
        });

        it('should correctly encode a Unicode string (NFKD)', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64(testVectors.unicodeNfkd.base64);
            const expected = testVectors.unicodeNfkd.string;
            expect(string).to.equal(expected);
        });

        it('should correctly encode an empty string', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64(testVectors.empty.base64);
            const expected = testVectors.empty.string;
            expect(string).to.equal(expected);
        });

        it('should throw error on invalid Base64 strings', (): void => {
            try {
                defaultStringConverterInstance.decodeFromBase64('ŐO1wbPZt4XRpcSBpcyBjb/xsLg==');
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
                defaultStringConverterInstance.decodeFromBase64('RO1wbPZt4XRpcSBpcyBjb/xsLg=');
                expect.fail('did not throw');
            } catch (e) {
                if (e instanceof Error) {
                    expect(e.message).to.be.equal('Base64 decode error');
                } else {
                    expect.fail('exception is not of Error type');
                }
            }

            try {
                defaultStringConverterInstance.decodeFromBase64('RO1wbPZt4XRpcSBpcyBjb/xsLg');
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
        it('should correctly encode an ASCII string', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64Url(testVectors.ascii.string);
            const expected = testVectors.ascii.base64url;
            expect(base64).to.equal(expected);
        });

        it('should correctly encode an extended ASCII string', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64Url(testVectors.extendedAscii.string);
            const expected = testVectors.extendedAscii.base64url;
            expect(base64).to.equal(expected);
        });

        it('should correctly encode a Unicode string (NFC)', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64Url(testVectors.unicodeNfc.string);
            const expected = testVectors.unicodeNfc.base64url;
            expect(base64).to.equal(expected);
        });

        it('should correctly encode a Unicode string (NFD)', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64Url(testVectors.unicodeNfd.string);
            const expected = testVectors.unicodeNfd.base64url;
            expect(base64).to.equal(expected);
        });

        it('should correctly encode a Unicode string (NFKC)', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64Url(testVectors.unicodeNfkc.string);
            const expected = testVectors.unicodeNfkc.base64url;
            expect(base64).to.equal(expected);
        });

        it('should correctly encode a Unicode string (NFKD)', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64Url(testVectors.unicodeNfkd.string);
            const expected = testVectors.unicodeNfkd.base64url;
            expect(base64).to.equal(expected);
        });

        it('should correctly encode an empty string', (): void => {
            const base64 = defaultStringConverterInstance.encodeToBase64Url(testVectors.empty.string);
            const expected = testVectors.empty.base64url;
            expect(base64).to.equal(expected);
        });
    });

    describe('decodeFromBase64Url', (): void => {
        it('should correctly decode an ASCII string', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64Url(testVectors.ascii.base64url);
            const expected = testVectors.ascii.string;
            expect(string).to.equal(expected);
        });

        it('should correctly decode an extended ASCII string', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64Url(testVectors.extendedAscii.base64url);
            const expected = testVectors.extendedAscii.string;
            expect(string).to.equal(expected);
        });

        it('should correctly decode a Unicode string (NFC)', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64Url(testVectors.unicodeNfc.base64url);
            const expected = testVectors.unicodeNfc.string;
            expect(string).to.equal(expected);
        });

        it('should correctly decode a Unicode string (NFD)', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64Url(testVectors.unicodeNfd.base64url);
            const expected = testVectors.unicodeNfd.string;
            expect(string).to.equal(expected);
        });

        it('should correctly decode a Unicode string (NFKC)', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64Url(testVectors.unicodeNfkc.base64url);
            const expected = testVectors.unicodeNfkc.string;
            expect(string).to.equal(expected);
        });

        it('should correctly decode a Unicode string (NFKD)', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64Url(testVectors.unicodeNfkd.base64url);
            const expected = testVectors.unicodeNfkd.string;
            expect(string).to.equal(expected);
        });

        it('should correctly decode an empty string', (): void => {
            const string = defaultStringConverterInstance.decodeFromBase64Url(testVectors.empty.base64url);
            const expected = testVectors.empty.string;
            expect(string).to.equal(expected);
        });
    });
});
