# Drizzle Transaction Example

```ts
import { and, eq, gte, sql } from "drizzle-orm";

type Db = {
  transaction: <T>(fn: (tx: Tx) => Promise<T>) => Promise<T>;
};

type Tx = {
  query: {
    account: {
      findFirst: (q: unknown) => Promise<{ id: string; balance: number } | undefined>;
    };
  };
  update: (table: unknown) => {
    set: (values: Record<string, unknown>) => {
      where: (clause: unknown) => Promise<{ rowsAffected: number }>;
    };
  };
  insert: (table: unknown) => {
    values: (row: Record<string, unknown>) => Promise<void>;
  };
};

declare const account: unknown;
declare const ledger: unknown;

export async function debit(db: Db, account_id: string, amount: number) {
  if (amount <= 0) throw new Error("amount must be positive");

  return db.transaction(async (tx) => {
    const row = await tx.query.account.findFirst({
      where: eq(sql`id`, account_id),
      columns: { id: true, balance: true },
    });
    if (!row) throw new Error("account not found");
    if (row.balance < amount) throw new Error("insufficient funds");

    const res = await tx
      .update(account)
      .set({ balance: row.balance - amount })
      .where(and(eq(sql`id`, account_id), gte(sql`balance`, amount)));

    if (res.rowsAffected !== 1) throw new Error("concurrent update conflict");

    await tx.insert(ledger).values({
      id: crypto.randomUUID(),
      account_id,
      amount: -amount,
      created_at: Date.now(),
    });

    return { account_id, debited: amount };
  });
}
```
