# API Boundary Validation Example

```ts
import { z } from "zod";

const in_schema = z.object({
  email: z.email(),
  role: z.enum(["admin", "member"]).default("member"),
});

const out_schema = z.object({
  id: z.string(),
  email: z.email(),
  role: z.enum(["admin", "member"]),
});

type Ctx = {
  req: {
    json: () => Promise<unknown>;
  };
  json: (body: unknown, status?: number) => Response;
};

export async function post_user(ctx: Ctx) {
  const raw = await ctx.req.json();
  const parsed = in_schema.safeParse(raw);
  if (!parsed.success)
    return ctx.json({ error: "invalid_input", detail: parsed.error.issues }, 400);

  const row = await create_user(parsed.data);
  const out = out_schema.parse(row);
  return ctx.json(out, 201);
}

async function create_user(input: z.infer<typeof in_schema>) {
  return {
    id: crypto.randomUUID(),
    email: input.email,
    role: input.role,
  };
}
```
