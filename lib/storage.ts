export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  goalId: number | null;
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  targetDate: string;
  createdAt: string;
  tasks: number[];
  completed: boolean;
}

// Tasks
export function getTasks(): Task[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("tm_tasks");
  return raw ? JSON.parse(raw) : [];
}

export function saveTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("tm_tasks", JSON.stringify(tasks));
}

// Goals
export function getGoals(): Goal[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("tm_goals");
  return raw ? JSON.parse(raw) : [];
}

export function saveGoals(goals: Goal[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("tm_goals", JSON.stringify(goals));
}
