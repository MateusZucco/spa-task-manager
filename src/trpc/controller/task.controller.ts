import * as taskModel from "../model/task.model";

type CreateInput = Parameters<typeof taskModel.create>[0];
type UpdateArgs = Parameters<typeof taskModel.update>[0];
type TaskId = Parameters<typeof taskModel.getById>[0];

export function getAll(input?: Parameters<typeof taskModel.getAll>[0]) {
  return taskModel.getAll(input);
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

export async function remove(id: TaskId) {
  const result = taskModel.deleteTask(id);
  return result;
}
