export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

interface StoredUser extends User {
  password: string;
}

interface OTPEntry {
  email: string;
  code: string;
  expiresAt: number;
  type: "email" | "phone";
}

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("tm_users");
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem("tm_users", JSON.stringify(users));
}

function getOTPs(): OTPEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("tm_otps");
  return raw ? JSON.parse(raw) : [];
}

function saveOTPs(otps: OTPEntry[]) {
  localStorage.setItem("tm_otps", JSON.stringify(otps));
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function signup(
  name: string,
  email: string,
  password: string,
  phone?: string
): { success: boolean; error?: string } {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "Email already registered." };
  }
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    phone: phone || "",
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  const { password: _, ...safe } = user;
  localStorage.setItem("tm_user", JSON.stringify(safe));
  return { success: true };
}

export function login(
  email: string,
  password: string
): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return { success: false, error: "No account with that email." };
  if (user.password !== password)
    return { success: false, error: "Incorrect password." };
  const { password: _, ...safe } = user;
  localStorage.setItem("tm_user", JSON.stringify(safe));
  return { success: true };
}

export function logout() {
  localStorage.removeItem("tm_user");
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("tm_user");
  return raw ? JSON.parse(raw) : null;
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}

export function updateUserName(name: string) {
  const user = getUser();
  if (!user) return;
  user.name = name;
  localStorage.setItem("tm_user", JSON.stringify(user));
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx].name = name;
    saveUsers(users);
  }
}

export function updateUserPhone(phone: string) {
  const user = getUser();
  if (!user) return;
  user.phone = phone;
  localStorage.setItem("tm_user", JSON.stringify(user));
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx].phone = phone;
    saveUsers(users);
  }
}

// Request OTP for password recovery
// In production this would send a real email/SMS via an API
// For now we store the OTP in localStorage and show it in the UI
export function requestPasswordOTP(
  identifier: string,
  type: "email" | "phone"
): { success: boolean; otp?: string; error?: string } {
  const users = getUsers();
  let user: StoredUser | undefined;

  if (type === "email") {
    user = users.find((u) => u.email === identifier);
  } else {
    user = users.find((u) => u.phone === identifier);
  }

  if (!user) {
    return {
      success: false,
      error: type === "email" ? "No account with that email." : "No account with that phone number.",
    };
  }

  const code = generateOTP();
  const otps = getOTPs().filter((o) => o.email !== user!.email);
  otps.push({
    email: user.email,
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    type,
  });
  saveOTPs(otps);

  // In production: send via email/SMS service
  // For now return the OTP so UI can display it as a simulated notification
  return { success: true, otp: code };
}

// Verify OTP and allow password reset
export function verifyOTP(
  identifier: string,
  code: string,
  type: "email" | "phone"
): { success: boolean; error?: string; resetToken?: string } {
  const otps = getOTPs();
  const users = getUsers();

  let userEmail: string;
  if (type === "email") {
    userEmail = identifier;
  } else {
    const user = users.find((u) => u.phone === identifier);
    if (!user) return { success: false, error: "Account not found." };
    userEmail = user.email;
  }

  const entry = otps.find(
    (o) => o.email === userEmail && o.code === code && o.type === type
  );

  if (!entry) {
    return { success: false, error: "Invalid OTP code." };
  }

  if (Date.now() > entry.expiresAt) {
    return { success: false, error: "OTP has expired. Please request a new one." };
  }

  // Remove used OTP
  saveOTPs(otps.filter((o) => o.email !== userEmail));

  // Generate a reset token (simulated)
  const resetToken = crypto.randomUUID();
  localStorage.setItem(
    "tm_reset_token",
    JSON.stringify({ email: userEmail, token: resetToken, expiresAt: Date.now() + 10 * 60 * 1000 })
  );

  return { success: true, resetToken };
}

// Reset password using token
export function resetPassword(
  token: string,
  newPassword: string
): { success: boolean; error?: string } {
  const raw = localStorage.getItem("tm_reset_token");
  if (!raw) return { success: false, error: "Invalid or expired reset link." };

  const resetData = JSON.parse(raw);
  if (resetData.token !== token || Date.now() > resetData.expiresAt) {
    localStorage.removeItem("tm_reset_token");
    return { success: false, error: "Reset link has expired." };
  }

  const users = getUsers();
  const idx = users.findIndex((u) => u.email === resetData.email);
  if (idx === -1) return { success: false, error: "Account not found." };

  users[idx].password = newPassword;
  saveUsers(users);
  localStorage.removeItem("tm_reset_token");

  return { success: true };
}
