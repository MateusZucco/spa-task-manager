import TaskDatabase from "../db/fake-database";
import { Task, TaskList } from "../utils/schemas/tasks.schema";

const db = TaskDatabase.getInstance();

function getNowIsoTime(): string {
  return new Date().toISOString();
}

/**
 * CREATE: Automatically generates Id and createDateTime
 */
export function create(data: {
  title: Task["title"];
  description?: Task["description"];
}): Task {
  const id = Math.random().toString(36).substring(2, 8);

  const newTask: Task = {
    ...data,
    id,
    createDateTime: getNowIsoTime(),
  };

  db.set(id, newTask);
  return newTask;
}

/**
 * READ: Lists all tasks
 */
export function getAll(): TaskList {
  return db.values();
}

/**
 * READ: Finds a specific task by Id
 */
export function getById(id: Task["id"]): Task | undefined {
  if (id) return db.get(id.toString());
  else return undefined;
}

/**
 * UPDATE: Updates title, description and updateDateTime
 */
export function update({
  id,
  form,
}: {
  id: Task["id"];
  form: Partial<Task>;
}): Task | undefined {
  if (id) {
    const existingTask = db.get(id.toString());

    if (!existingTask) {
      throw new Error(`Task with ID ${id} not found in the database.`);
    }

    const updatedTask: Task = {
      ...existingTask,
      ...form,
      updateDateTime: getNowIsoTime(),
    };

    db.set(id.toString(), updatedTask);
    return updatedTask;
  } else return undefined;
}

/**
 * DELETE: Removes the task from the Map
 */
function deleteTask(id: Task["id"]): boolean {
  if (id) return db.remove(id.toString());
  else return false;
}

export { deleteTask as delete };
