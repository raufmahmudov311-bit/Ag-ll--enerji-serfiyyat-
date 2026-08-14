import { User } from "@/types/user";

/**
 * Demo authentication.
 *
 * Stores a single demo user in localStorage so the login/register flow and
 * the dashboard's "protected route" behaviour feel real. There is no
 * password check and no server involved — this exists purely so the UI
 * structure (forms, redirects, session state) is already correct when a
 * real auth/database backend (NextAuth, Clerk, a custom API, etc.) is
 * wired in later. Swap the bodies of these functions only; call sites
 * elsewhere in the app do not need to change.
 */

const STORAGE_KEY = "smart-energy:session";

const DEMO_USER: User = {
  userId: "user-001",
  name: "Elvin Məmmədov",
  email: "elvin@example.com",
};

export async function login(email: string, _password: string): Promise<User> {
  await simulateLatency();
  const user: User = { ...DEMO_USER, email };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  return user;
}

export async function register(name: string, email: string, _password: string): Promise<User> {
  await simulateLatency();
  const user: User = { userId: "user-001", name, email };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  return user;
}

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, 450));
}
