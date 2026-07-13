"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-sm space-y-5">
      <div>
        <label className="display mb-2 block text-[0.65rem] tracking-[0.18em] uppercase text-muted">
          Username
        </label>
        <input
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-seam bg-panel px-3 py-2.5 text-sm text-foreground outline-none focus:border-seam-strong"
          required
        />
      </div>
      <div>
        <label className="display mb-2 block text-[0.65rem] tracking-[0.18em] uppercase text-muted">
          Password
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-seam bg-panel px-3 py-2.5 text-sm text-foreground outline-none focus:border-seam-strong"
          required
        />
      </div>
      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="display w-full border border-seam-strong bg-foreground px-4 py-3 text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-background disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Enter dashboard"}
      </button>
    </form>
  );
}
