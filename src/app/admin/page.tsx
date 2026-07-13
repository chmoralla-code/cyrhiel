import { AdminDashboard } from "@/components/admin/dashboard";
import { getSiteContent } from "@/lib/content-store";

export const metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await getSiteContent();
  return (
    <main className="site-atmosphere min-h-svh">
      <AdminDashboard initial={content} />
    </main>
  );
}
