export const dynamic = "force-dynamic";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  goalId: number | null;
}

let tasks: Task[] = [];
let nextId = 1;

export function seedTasks(stored: Task[]) {
  if (stored.length > 0 && tasks.length === 0) {
    tasks = stored;
    nextId = Math.max(...stored.map((t) => t.id), 0) + 1;
  }
}

export async function GET() {
  return Response.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();

  // Seed from localStorage on first POST if provided
  if (body._seed && Array.isArray(body._seed) && tasks.length === 0) {
    tasks = body._seed;
    nextId = Math.max(...tasks.map((t) => t.id), 0) + 1;
    return Response.json(tasks);
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";

  if (!title) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }
  if (title.length > 200) {
    return Response.json(
      { error: "Title must be 200 characters or less" },
      { status: 400 }
    );
  }

  const task: Task = {
    id: nextId++,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
    priority: body.priority || "medium",
    dueDate: body.dueDate || null,
    goalId: body.goalId ?? null,
  };

  tasks.push(task);
  return Response.json(task, { status: 201 });
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));

  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }

  task.completed = !task.completed;
  return Response.json(task);
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));

  if (id === -1) {
    tasks = [];
    nextId = 1;
    return Response.json({ success: true });
  }

  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }

  tasks.splice(index, 1);
  return Response.json({ success: true });
}
