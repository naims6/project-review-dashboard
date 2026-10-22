import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-white" style={{ fontFamily: "var(--font-inter)" }}>
      <Navbar />
      <main className="flex-1 pt-14">{children}</main>
      <Footer />
    </div>
  );
}
