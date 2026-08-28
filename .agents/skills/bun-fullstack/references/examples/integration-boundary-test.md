# Integration Boundary Test Example

```ts
import { beforeEach, describe, expect, test } from "bun:test";

type App = {
  inject: (req: { method: string; path: string; body?: unknown }) => Promise<{
    status: number;
    json: () => Promise<unknown>;
  }>;
};

declare function make_app(): Promise<App>;
declare function reset_db(): Promise<void>;

describe("user create flow", () => {
  let app: App;

  beforeEach(async () => {
    await reset_db();
    app = await make_app();
  });

  test("returns 400 on invalid payload", async () => {
    const res = await app.inject({
      method: "POST",
      path: "/users",
      body: { email: "not-an-email" },
    });
    expect(res.status).toBe(400);
  });

  test("persists row and returns API shape", async () => {
    const res = await app.inject({
      method: "POST",
      path: "/users",
      body: { email: "dev@team.com", role: "member" },
    });
    expect(res.status).toBe(201);

    const body = (await res.json()) as { id: string; email: string; role: string };
    expect(body.email).toBe("dev@team.com");
    expect(body.role).toBe("member");
    expect(body.id.length).toBeGreaterThan(0);
  });
});
```
