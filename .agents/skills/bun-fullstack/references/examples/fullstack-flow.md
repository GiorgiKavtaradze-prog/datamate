# Fullstack Request-to-Response Mapping Example

```ts
import { z } from "zod";

const in_schema = z.object({
  title: z.string().min(1),
  done: z.boolean().default(false),
});

const out_schema = z.object({
  id: z.string(),
  title: z.string(),
  done: z.boolean(),
  created_at: z.number(),
});

type Db = {
  insert: (table: unknown) => {
    values: (row: Record<string, unknown>) => {
      returning: () => Promise<unknown[]>;
    };
  };
};

declare const todos: unknown;

export async function post_todo(body: unknown, db: Db) {
  const parsed = in_schema.safeParse(body);
  if (!parsed.success)
    return { status: 400, body: { error: "invalid_input", detail: parsed.error.issues } };

  const rows = await db
    .insert(todos)
    .values({
      id: crypto.randomUUID(),
      title: parsed.data.title,
      done: parsed.data.done,
      created_at: Date.now(),
    })
    .returning();

  const row = rows.at(0);
  if (!row) return { status: 500, body: { error: "insert_failed" } };

  const out = out_schema.parse(row);
  return { status: 201, body: out };
}
```
