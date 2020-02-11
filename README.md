# convertibles

TypeScript utility library to convert values between textual and binary representation.

<p>
<a href="https://travis-ci.org/Diplomatiq/convertibles" target="_blank" style="text-decoration: none;">
	<img src="https://img.shields.io/travis/Diplomatiq/convertibles.svg" alt="build status">
</a>

<a href="https://github.com/Diplomatiq/convertibles" target="_blank" style="text-decoration: none;">
	<img src="https://img.shields.io/github/languages/top/Diplomatiq/convertibles.svg" alt="languages used">
</a>

<a href="https://www.npmjs.com/package/@diplomatiq/convertibles" target="_blank" style="text-decoration: none;">
	<img src="https://img.shields.io/npm/dt/@diplomatiq/convertibles.svg" alt="downloads from npm">
</a>

<a href="https://www.npmjs.com/package/@diplomatiq/convertibles" target="_blank" style="text-decoration: none;">
	<img src="https://img.shields.io/npm/v/@diplomatiq/convertibles.svg" alt="latest released version on npm">
</a>

<a href="https://github.com/Diplomatiq/convertibles/blob/master/LICENSE" target="_blank" style="text-decoration: none;">
	<img src="https://img.shields.io/npm/l/@diplomatiq/convertibles.svg" alt="license">
</a>
</p>

<p>
<a href="https://sonarcloud.io/dashboard?id=Diplomatiq_convertibles" target="_blank" style="text-decoration: none;">
	<img src="https://sonarcloud.io/api/project_badges/measure?project=Diplomatiq_convertibles&metric=alert_status" alt="Quality Gate">
</a>

<a href="https://sonarcloud.io/dashboard?id=Diplomatiq_convertibles" target="_blank" style="text-decoration: none;">
	<img src="https://sonarcloud.io/api/project_badges/measure?project=Diplomatiq_convertibles&metric=coverage" alt="Coverage">
</a>

<a href="https://sonarcloud.io/dashboard?id=Diplomatiq_convertibles" target="_blank" style="text-decoration: none;">
	<img src="https://sonarcloud.io/api/project_badges/measure?project=Diplomatiq_convertibles&metric=sqale_rating" alt="Maintainability Rating">
</a>

<a href="https://sonarcloud.io/dashboard?id=Diplomatiq_convertibles" target="_blank" style="text-decoration: none;">
	<img src="https://sonarcloud.io/api/project_badges/measure?project=Diplomatiq_convertibles&metric=reliability_rating" alt="Reliability Rating">
</a>

<a href="https://sonarcloud.io/dashboard?id=Diplomatiq_convertibles" target="_blank" style="text-decoration: none;">
	<img src="https://sonarcloud.io/api/project_badges/measure?project=Diplomatiq_convertibles&metric=security_rating" alt="Security Rating">
</a>

<a href="https://github.com/Diplomatiq/convertibles/pulls" target="_blank" style="text-decoration: none;">
	<img src="https://api.dependabot.com/badges/status?host=github&repo=Diplomatiq/convertibles" alt="Dependabot">
</a>
</p>

<p>
<a href="https://gitter.im/Diplomatiq/convertibles" target="_blank" style="text-decoration: none;">
	<img src="https://badges.gitter.im/Diplomatiq/convertibles.svg" alt="Gitter">
</a>
</p>

---

## Installation

Being an npm package, you can install convertibles with the following command:

```bash
npm install -P @diplomatiq/convertibles
```

## Testing

Run tests with the following:

```bash
npm test
```

## Goals

This module is built with the intention to help:

-   encode a source value into a better-suited serialization format,
-   decode the serialized format and get the source value back.

For example, you have a meaningful Unicode string value as the source value. This source value is what your application works with, this is what your business logic is built upon.

Sometimes you want to store or transmit this source value in different formats. You want to encode the source value into something less complex and better manageable target value, like:

-   a byte array (e.g. for storing it in binary structures),
-   a Base64 string (e.g. for transmitting it as the part of a JSON payload),
-   or a Base64URL string (e.g. for storing it as a filename or putting it into a URL).

## Supported source and target formats

Currently the following source formats are supported.

| Source format  | to/from Uint8Array | to/from Base64     | to/from Base64URL  | to/from hex        |
| -------------- | ------------------ | ------------------ | ------------------ | ------------------ |
| Unicode string | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: \*             |
| Uint8Array     | :heavy_minus_sign: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |

\* Of course, no one stops you from converting a Unicode string into a Uint8Array, then to hex.

## Usage

_Note: This package is built as an ES6 package. You will not be able to use `require()`._

Every source format has a converter class:

-   for Unicode strings, use the `DefaultStringConverter` class,
-   for byte arrays, use the `DefaultBinaryConverter` class.

Besides converters, there are transformers, which does not really convert, but rather just minimally transform:

-   to transform a Base64 value to/from Base64URL, use the `DefaultBase64UrlTransformer` class.

After installation, import the appropriate class into your project, and use its API after instantiation:

```typescript
import { DefaultStringConverter } from '@diplomatiq/convertibles';

// …

function main() {
    const source = 'Dįplőmàtiq Å & Å is eﬀective.';

    const stringConverter = new DefaultStringConverter();

    const asBytes = stringConverter.encodeToBytes(source);
    console.log(asBytes); // Uint8Array(41) [68, 105, 204, …]
    console.log(stringConverter.decodeFromBytes(asBytes)); // 'Dįplőmàtiq Å & Å is eﬀective.'

    const asBase64 = stringConverter.encodeToBase64(source);
    console.log(asBase64); // 'RGnMqHBsb8yLbWHMgHRpcSBBzIogJiBBzIogaXMgZe+sgGVjdGl2ZS4='
    console.log(stringConverter.decodeFromBase64(asBase64)); // 'Dįplőmàtiq Å & Å is eﬀective.'

    const asBase64Url = stringConverter.encodeToBase64Url(source);
    console.log(asBase64Url); // 'RGnMqHBsb8yLbWHMgHRpcSBBzIogJiBBzIogaXMgZe-sgGVjdGl2ZS4'
    console.log(stringConverter.decodeFromBase64Url(asBase64Url)); // 'Dįplőmàtiq Å & Å is eﬀective.'
}
```

## API

### DefaultStringConverter

#### Instantiation

You can inject your own UTF-8 encoder/decoder, binary converter, or Base64URL transformer, as long as they implement the required interfaces.

```typescript
constructor(
  private readonly utf8Encoder: Utf8Encoder = new TextEncoder(),
  private readonly utf8Decoder: Utf8Decoder = new TextDecoder('utf-8', { fatal: true }),
  private readonly binaryConverter: BinaryConverter = new DefaultBinaryConverter(),
  private readonly base64UrlTransformer: Base64UrlTransformer = new DefaultBase64UrlTransformer(),
) {}
```

Instantiated without constructor parameters, `DefaultStringConverter` will use the defaults:

```typescript
const stringConverter = new DefaultStringConverter();
```

#### encodeToBytes(string: string): Uint8Array;

```typescript
/**
 * Encodes a Unicode string into UTF-8 binary representation.
 * Symmetric to @member decodeFromBytes.
 * Does not throw.
 */
encodeToBytes(string: string): Uint8Array;
```

#### decodeFromBytes(bytes: Uint8Array): string;

```typescript
/**
 * Decodes the UTF-8 binary representation of a Unicode string.
 * Symmetric to @member encodeToBytes.
 * Throws if decoding is unsuccessful.
 */
decodeFromBytes(bytes: Uint8Array): string;
```

#### encodeToBase64(string: string): string;

```typescript
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
encodeToBase64(string: string): string;
```

#### decodeFromBase64(base64: string): string;

```typescript
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
decodeFromBase64(base64: string): string;
```

#### encodeToBase64Url(string: string): string;

```typescript
/**
 * Encodes a Unicode string into (URL- and filename-safe) Base64URL format.
 * Symmetric to @member decodeFromBase64Url.
 * Does not throw.
 */
encodeToBase64Url(string: string): string;
```

#### decodeFromBase64Url(base64url: string): string;

```typescript
/**
 * Decodes a (URL- and filename-safe) Base64URL-encoded Unicode string.
 * Symmetric to @member encodeToBase64Url.
 * Throws if decoding is unsuccessful.
 */
decodeFromBase64Url(base64url: string): string;
```

### DefaultBinaryConverter

#### Instantiation

You can inject your own Base64URL transformer, as long as it implements the required interface.

```typescript
constructor(
  private readonly base64UrlTransformer: Base64UrlTransformer = new DefaultBase64UrlTransformer(),
) {}
```

Instantiated without constructor parameters, `DefaultBinaryConverter` will use the defaults:

```typescript
const binaryConverter = new DefaultBinaryConverter();
```

#### encodeToHex(bytes: Uint8Array): string;

```typescript
/**
 * Encodes a binary representation into a hexadecimal string.
 * Does not throw.
 */
encodeToHex(bytes: Uint8Array): string;
```

#### decodeFromHex(hex: string): Uint8Array;

```typescript
/**
 * Decodes a hexadecimal string into a binary representation.
 * Throws if decoding is unsuccessful.
 */
decodeFromHex(hex: string): Uint8Array;
```

#### encodeToBase64(bytes: Uint8Array): string;

```typescript
/**
 * Encodes a binary representation into Base64 format.
 * Does not throw.
 */
encodeToBase64(bytes: Uint8Array): string;
```

#### decodeFromBase64(base64: string): Uint8Array;

```typescript
/**
 * Decodes a Base64-encoded binary representation.
 * Throws if decoding is unsuccessful.
 */
decodeFromBase64(base64: string): Uint8Array;
```

#### encodeToBase64Url(bytes: Uint8Array): string;

```typescript
/**
 * Encodes a binary representation into (URL- and filename-safe) Base64URL format.
 */
encodeToBase64Url(bytes: Uint8Array): string;
```

#### decodeFromBase64Url(base64Url: string): Uint8Array;

```typescript
/**
 * Decodes a (URL- and filename-safe) Base64URL-encoded binary representation.
 */
decodeFromBase64Url(base64Url: string): Uint8Array;
```

### DefaultBase64UrlTransformer

#### transformBase64ToBase64Url(base64: string): string;

```typescript
/**
 * Transforms a Base64 representation to Base64URL.
 * Symmetric to @member transformBase64UrlToBase64.
 */
transformBase64ToBase64Url(base64: string): string;
```

#### transformBase64UrlToBase64(base64Url: string): string;

```typescript
/**
 * Transforms a Base64URL representation to Base64.
 * Symmetric to @member transformBase64ToBase64Url.
 */
transformBase64UrlToBase64(base64Url: string): string;
```

## Development

See [CONTRIBUTING.md](https://github.com/Diplomatiq/convertibles/blob/develop/CONTRIBUTING.md) for details.

---

Copyright (c) 2018 Diplomatiq
