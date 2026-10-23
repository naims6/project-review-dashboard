import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMe } from "@/lib/api/get-me";
import type { User } from "@/types/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: User | null = null;
  try {
    user = await getMe();
  } catch {
    // not logged in — render guest navbar
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-white">
      <Navbar user={user} />
      <main className="flex-1 pt-14">{children}</main>
      <Footer />
    </div>
  );
}
