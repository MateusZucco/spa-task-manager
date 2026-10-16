import { describe, expect, it } from "vitest";
import { MockDatabase } from "../../src/db/mock-database";
import { TaskNotFoundError, TaskValidationError } from "../../src/api/task.errors";
import { TaskModel } from "../../src/api/task.model";
import { TaskService } from "../../src/api/task.service";
import type { Task } from "../../src/api/task.types";

function createService(tasks: Task[] = []) {
  return new TaskService(new TaskModel(new MockDatabase(tasks)));
}

const sample: Task = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Existing task",
  description: "Already stored",
  createdAt: "2026-10-01T00:00:00.000Z",
};

describe("TaskService", () => {
  it("rejects a task without a name", () => {
    const service = createService();

    expect(() =>
      service.create({ name: "   ", description: "Details" }),
    ).toThrow(TaskValidationError);
  });

  it("rejects a task without a description", () => {
    const service = createService();

    expect(() => service.create({ name: "Title", description: "" })).toThrow(
      TaskValidationError,
    );
  });

  it("stores a trimmed task and sets the creation date", () => {
    const service = createService();
    const created = service.create({
      name: "  Ship notes  ",
      description: "  Write the release notes  ",
    });

    expect(created.name).toBe("Ship notes");
    expect(created.description).toBe("Write the release notes");
    expect(created.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(service.getById(created.id)).toEqual(created);
  });

  it("rejects an incomplete update", () => {
    const service = createService([sample]);

    expect(() =>
      service.update({ id: sample.id, name: "Updated", description: " " }),
    ).toThrow(TaskValidationError);
    expect(service.getById(sample.id).name).toBe(sample.name);
  });

  it("updates name and description and keeps the creation date", () => {
    const service = createService([sample]);
    const updated = service.update({
      id: sample.id,
      name: "Renamed",
      description: "New details",
    });

    expect(updated).toEqual({
      ...sample,
      name: "Renamed",
      description: "New details",
    });
  });

  it("deletes a task and reports a missing one", () => {
    const service = createService([sample]);

    expect(service.delete(sample.id)).toEqual({ id: sample.id });
    expect(() => service.getById(sample.id)).toThrow(TaskNotFoundError);
    expect(() => service.delete(sample.id)).toThrow(TaskNotFoundError);
  });

  it("returns the next page cursor while tasks remain", () => {
    const tasks: Task[] = [3, 2, 1].map((day) => ({
      id: `00000000-0000-4000-8000-00000000000${day}`,
      name: `Task ${day}`,
      description: `Description ${day}`,
      createdAt: `2026-10-0${day}T00:00:00.000Z`,
    }));
    const service = createService(tasks);

    const firstPage = service.list({ limit: 2 });
    expect(firstPage.items.map((task) => task.name)).toEqual([
      "Task 3",
      "Task 2",
    ]);
    expect(firstPage.nextCursor).toBe(tasks[1].id);

    const secondPage = service.list({
      limit: 2,
      cursor: firstPage.nextCursor ?? undefined,
    });
    expect(secondPage.items.map((task) => task.name)).toEqual(["Task 1"]);
    expect(secondPage.nextCursor).toBeNull();
  });
});
