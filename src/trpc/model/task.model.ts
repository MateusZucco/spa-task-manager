import TaskDatabase from "../db/fake-database";
import { Task, TaskList } from "../schema/tasks.schema";

const db = TaskDatabase.getInstance();

function getNowIsoTime(): string {
  return new Date().toISOString();
}

function getExistingTask(id: Task["id"]): Task | undefined {
  const existingTask = db.get(id.toString());

  if (!existingTask) {
    return undefined;
  }

  return existingTask;
}

function validateExistingTask(id: Task["id"]): Task {
  if (!id) throw new Error(`Id is required.`);
  const existingTask = getExistingTask(id);
  if (!existingTask) {
    throw new Error(`Task not found in the database.`);
  }
  return existingTask;
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
  try {
    validateExistingTask(id);
    return db.get(id.toString());
  } catch (error) {
    throw error;
  }
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
  try {
    const existingTask = validateExistingTask(id);

    const updatedTask: Task = {
      ...existingTask,
      ...form,
      updateDateTime: getNowIsoTime(),
    };

    db.set(id.toString(), updatedTask);
    return updatedTask;
  } catch (error) {
    throw error;
  }
}

/**
 * DELETE: Removes the task from the Map
 */
export function deleteTask(id: Task["id"]): boolean {
  try {
    console.log('deleteTask', id);
    validateExistingTask(id);
    return db.remove(id.toString());
  } catch (error) {
    throw error;
  }
}
