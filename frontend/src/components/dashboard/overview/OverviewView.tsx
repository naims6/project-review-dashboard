"use client";

import type { User } from "@/types/auth";
import { StudentOverview } from "./StudentOverview";
import { MentorAdminOverview } from "./MentorAdminOverview";

interface OverviewViewProps {
  user: User;
}

export function OverviewView({ user }: OverviewViewProps) {
  if (user.role === "STUDENT") {
    return <StudentOverview user={user} />;
  }
  return <MentorAdminOverview user={user} />;
}
