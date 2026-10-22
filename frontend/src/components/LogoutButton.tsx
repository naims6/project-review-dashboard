"use client";

import { logout } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
      className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
    >
      <LogOut className="w-3.5 h-3.5 text-violet-400 mr-1.5" />
      {loading ? "Signing out…" : "Sign out"}
    </Button>
  );
}
