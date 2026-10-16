import { Task, TaskList } from "../utils/schemas/tasks.schema";

/**
 *  Singleton Class to manage in-memory task storage
 */
class TaskDatabase {
  private tasks: Map<string, Task> = new Map();

  private constructor() {}

  /**
   * Singleton method
   */
  public static getInstance(): TaskDatabase {
    const globalKey = "_db_instance";
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