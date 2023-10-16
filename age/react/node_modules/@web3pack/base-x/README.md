[![CodeQL](https://github.com/Web3Pack/base-x/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Web3Pack/base-x/actions/workflows/codeql-analysis.yml)
[![Node.js Package](https://github.com/Web3Pack/base-x/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/Web3Pack/base-x/actions/workflows/npm-publish.yml)

# Base-x encoding library

A modern base-x encoding library implemented in TypeScript with minimal dependencies for use in browser and Node.js.

Following alphabets are supported:

-   Base2 = 01
-   Base16 = 0123456789abcdef
-   Base45 = 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%\*+-./:
-   Base58 = 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz

## Example

```ts
import { base58 } from '../src';

const base58Converter = base58();

const text = Buffer.from('Hello World!');

const base58Text = base58Converter.encode(text);
// => 2NEpo7TZRRrLZSi2U

const base58Decoded = base58Converter.decode(base58Text);
const base58DecodedText = Buffer.from(base58Decoded).toString();
// => Hello World!
```
