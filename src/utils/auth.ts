export type UserRole = "admin" | "employee";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

export const saveAuth = (user: AuthUser) => {
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("userRole", user.role);
  localStorage.setItem("userName", user.name);
  localStorage.setItem("userEmail", user.email);
};

export const clearAuth = () => {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
};

export const getAuth = (): AuthUser | null => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const role = localStorage.getItem("userRole") as UserRole | null;
  const name = localStorage.getItem("userName") ?? "";
  const email = localStorage.getItem("userEmail") ?? "";
  if (!isAuthenticated || !role) return null;
  return { name, email, role };
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem("isAuthenticated") === "true";
};

export const getDashboardPath = (role: UserRole): string => {
  return role === "admin" ? "/dashboard/admin" : "/dashboard/staff";
};
