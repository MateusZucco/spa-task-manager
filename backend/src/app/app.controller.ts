import * as taskModel from "./app.model";

type CreateInput = Parameters<typeof taskModel.create>[0];
type UpdateArgs = Parameters<typeof taskModel.update>[0];
type TaskId = Parameters<typeof taskModel.getById>[0];

export function getAll() {
  return taskModel.getAll();
}

export function getById(id: TaskId) {
  return taskModel.getById(id);
}

export async function create(input: CreateInput) {
  const result = await taskModel.create({ ...input });
  return result;
}

export async function update(
  input: { id: UpdateArgs["id"] } & UpdateArgs["form"],
) {
  const result = await taskModel.update({
    id: input.id,
    form: { ...input },
  });
  return result;
}

function deleteTask(id: TaskId) {
  const result = taskModel.delete(id);
  return result;
}

export { deleteTask as delete };
