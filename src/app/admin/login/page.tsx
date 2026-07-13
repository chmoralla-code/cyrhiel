import { AdminLoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="site-atmosphere flex min-h-svh items-center justify-center px-6 py-16">
      <div className="w-full max-w-md border border-seam bg-panel p-8">
        <p className="eyebrow">Admin</p>
        <h1 className="display mt-3 text-2xl font-semibold tracking-wide">
          Sign in
        </h1>
        <p className="mt-2 mb-8 text-sm text-muted">
          Edit and publish site content from the dashboard.
        </p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
