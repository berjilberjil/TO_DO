export const dynamic = "force-dynamic";

interface Goal {
  id: number;
  title: string;
  description: string;
  targetDate: string;
  createdAt: string;
  tasks: number[];
  completed: boolean;
}

let goals: Goal[] = [];
let nextId = 1;

export async function GET() {
  return Response.json(goals);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body._seed && Array.isArray(body._seed) && goals.length === 0) {
    goals = body._seed;
    nextId = Math.max(...goals.map((g) => g.id), 0) + 1;
    return Response.json(goals);
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }

  const goal: Goal = {
    id: nextId++,
    title,
    description: body.description?.trim() || "",
    targetDate: body.targetDate || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    tasks: body.tasks || [],
    completed: false,
  };

  goals.push(goal);
  return Response.json(goal, { status: 201 });
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));

  const goal = goals.find((g) => g.id === id);
  if (!goal) {
    return Response.json({ error: "Goal not found" }, { status: 404 });
  }

  goal.completed = !goal.completed;
  return Response.json(goal);
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));

  const index = goals.findIndex((g) => g.id === id);
  if (index === -1) {
    return Response.json({ error: "Goal not found" }, { status: 404 });
  }

  goals.splice(index, 1);
  return Response.json({ success: true });
}
