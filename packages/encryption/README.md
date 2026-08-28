# @datamate/encryption

Server-side helpers for encrypting integration secrets at rest. Used across services to store third-party credentials (API keys, tokens, webhook configurations) without keeping plaintext in the database.

## Usage

```ts
import { compare, decrypt, encrypt, generateKey } from "@datamate/encryption";

const masterKey = process.env.DATAMATE_ENCRYPTION_KEY;

// Encrypt a secret before persisting it
const ciphertext = encrypt("secret-value", masterKey);

// Decrypt at read time
const plaintext = decrypt(ciphertext, masterKey);

// Constant-time comparison of a plaintext against stored ciphertext
const matches = compare(plaintext, "secret-value");

// Generate a new master key
const newMasterKey = generateKey();
```

## Key management

- `DATAMATE_ENCRYPTION_KEY` must be high entropy and kept stable.
- The encrypted payload format is versioned so future algorithm changes remain backward compatible.
- Rotating the key requires re-encrypting every stored payload — plan rotations carefully.
- Never expose the master key to client-side code or logs.

