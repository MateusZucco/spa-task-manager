import Link from "next/link";

type EditTaskPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Edit task</h1>
      <p className="mt-4 text-sm text-foreground/70">
        Editing task <span className="font-medium text-foreground">{id}</span>.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm underline">
        Back to tasks
      </Link>
    </main>
  );
}
