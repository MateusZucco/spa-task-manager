import { Task, TaskList } from "../schema/tasks.schema";

const SEEDED_TASK_COUNT = 100;

function seedTasks(): Map<string, Task> {
  const tasks = new Map<string, Task>();
  const now = Date.now();

  for (let index = 1; index <= SEEDED_TASK_COUNT; index += 1) {
    const id = String(index);
    const createdAt = new Date(now - (SEEDED_TASK_COUNT - index) * 3_600_000);

    tasks.set(id, {
      id,
      title: `Task ${index}`,
      description: `Description ${index}`,
      createDateTime: createdAt.toISOString(),
      updateDateTime:
        index % 3 === 0
          ? new Date(createdAt.getTime() + 1_800_000).toISOString()
          : undefined,
    });
  }

  return tasks;
}

/**
 *  Singleton Class to manage in-memory task storage
 */
class TaskDatabase {
  private tasks: Map<string, Task> = seedTasks();

  private constructor() {}

  /**
   * Singleton method
   */
  public static getInstance(): TaskDatabase {
    const globalKey = "_task_db";
    const globalForDb = globalThis as unknown as {
      [key: string]: TaskDatabase;
    };

    if (!globalForDb[globalKey]) {
      globalForDb[globalKey] = new TaskDatabase();
    }

    return globalForDb[globalKey];
  }

  public get(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  public set(id: string, task: Task): void {
    this.tasks.set(id, task);
  }

  public values(): TaskList {
    return Array.from(this.tasks.values());
  }

  public remove(id: string): boolean {
    return this.tasks.delete(id);
  }
}

export default TaskDatabase;