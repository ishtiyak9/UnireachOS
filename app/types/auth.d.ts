declare module "#auth-utils" {
  interface User {
    id: string;
    email: string;
    roleName: string; // e.g. "Supreme Administrator"
    roleCode: string; // e.g. "super_admin"
    roleCategory: "SYSTEM" | "STAFF" | "AGENT" | "APPLICANT";
    permissions: string[]; // e.g. ["system:control", "user:manage"]
    status: string;
    profile: {
      firstName: string | null;
      lastName: string | null;
    } | null;
  }

  interface UserSession {
    user: User;
    loggedInAt: number;
  }
}

export {};
