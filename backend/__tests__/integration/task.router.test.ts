import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { createAppRouter } from "../../src/app.router";
import { MockDatabase } from "../../src/db/mock-database";

function createCaller() {
  return createAppRouter(new MockDatabase([])).createCaller({});
}

describe("task router", () => {
  it("creates, lists, updates, and deletes a task", async () => {
    const caller = createCaller();

    const created = await caller.task.create({
      name: "Prepare demo",
      description: "Walk through the task flows",
    });

    const page = await caller.task.list({ limit: 10 });
    expect(page.items).toEqual([created]);
    expect(page.nextCursor).toBeNull();

    const updated = await caller.task.update({
      id: created.id,
      name: "Prepare demo notes",
      description: "Cover create, edit, and delete",
    });
    expect(updated.createdAt).toBe(created.createdAt);

    const fetched = await caller.task.getById({ id: created.id });
    expect(fetched).toEqual(updated);

    await caller.task.delete({ id: created.id });
    const afterDelete = await caller.task.list({ limit: 10 });
    expect(afterDelete.items).toEqual([]);
  });

  it("rejects an incomplete task", async () => {
    const caller = createCaller();

    await expect(
      caller.task.create({ name: "   ", description: "Missing a title" }),
    ).rejects.toMatchObject({
      code: "BAD_REQUEST",
      message: "Name is required",
    } satisfies Partial<TRPCError>);
  });

  it("returns not found when the task is missing", async () => {
    const caller = createCaller();
    const missingId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";

    await expect(caller.task.getById({ id: missingId })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
});
