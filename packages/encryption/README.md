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

## Example: encrypting an integration secret

Storing a third-party token for a connected integration:

```ts
import { encrypt } from "@datamate/encryption";
import { integrationTokens } from "@datamate/db/schema";

async function storeIntegrationToken(
  integrationId: string,
  token: string,
  masterKey: string,
) {
  await db
    .insert(integrationTokens)
    .values({
      id: integrationId,
      encryptedToken: encrypt(token, masterKey),
    })
    .onConflictDoUpdate({
      target: integrationTokens.id,
      set: { encryptedToken: encrypt(token, masterKey) },
    });
}

async function readIntegrationToken(integrationId: string, masterKey: string) {
  const row = await db.query.integrationTokens.findFirst({
    where: (t, { eq }) => eq(t.id, integrationId),
  });
  return row ? decrypt(row.encryptedToken, masterKey) : null;
}
```

## Key rotation playbook

`DATAMATE_ENCRYPTION_KEY` is a master key shared across services. Rotating it is a coordinated operation — run it as a script that re-encrypts every stored payload:

```ts
// scripts/rotate-encryption-key.ts
import { decrypt, encrypt, generateKey } from "@datamate/encryption";
import { db, eq } from "@datamate/db";
import { integrationTokens } from "@datamate/db/schema";

// 1. Generate the new key and deploy it alongside the old one (dual-key window).
const newKey = generateKey();
const PAGE_SIZE = 500;

// 2. Re-encrypt in batches so the job is resumable and non-blocking.
let offset = 0;
while (true) {
  const rows = await db
    .select()
    .from(integrationTokens)
    .limit(PAGE_SIZE)
    .offset(offset);
  if (rows.length === 0) break;

  for (const row of rows) {
    const plaintext = decrypt(
      row.encryptedToken,
      process.env.OLD_ENCRYPTION_KEY!,
    );
    await db
      .update(integrationTokens)
      .set({ encryptedToken: encrypt(plaintext, newKey) })
      .where(eq(integrationTokens.id, row.id));
  }
  offset += rows.length;
}

// 3. After verification, swap the env var to the new key and remove the old one.
```

Because the payload format is versioned, old ciphertext remains decryptable during the window — rotate service by service, not all at once.

## Key management

- `DATAMATE_ENCRYPTION_KEY` must be high entropy and kept stable.
- The encrypted payload format is versioned so future algorithm changes remain backward compatible.
- Rotating the key requires re-encrypting every stored payload — plan rotations carefully.
- Never expose the master key to client-side code or logs.
