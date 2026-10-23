"use client";
import { createContext, useContext } from "react";
import type { User } from "@/types/auth";

const UserContext = createContext<User | null>(null);

interface UserProviderProps {
  user: User;
  children: React.ReactNode;
}

export function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): User {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error(
      "useUser() must be called inside a component that is a child of <UserProvider>. " +
        "Make sure your component is rendered within the dashboard layout.",
    );
  }
  return ctx;
}
