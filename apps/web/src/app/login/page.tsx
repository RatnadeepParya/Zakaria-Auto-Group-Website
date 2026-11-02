"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "75vh", display: "grid", placeItems: "center", padding: "40px 20px" }}>
      <div className="glass-panel" style={{ maxWidth: "440px", width: "100%", padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <span className="eyebrow">AUTHORIZED STAFF PORTAL</span>
          <h1 style={{ fontSize: "24px", color: "#fff", fontWeight: 800, marginTop: "4px" }}>
            Dealer Sign In
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "4px" }}>
            Sign in to manage inventory, inquiries, and credit applications.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "12px 14px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "8px",
              color: "#f87171",
              fontSize: "13px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <div>
            <label className="input-label">Admin Email</label>
            <input
              type="email"
              className="input-field"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@zakariaautogroup.com"
            />
          </div>

          <div>
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", marginTop: "8px" }}
          >
            {loading ? "Verifying..." : "Sign In Securely →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "12px" }}>
          <Link href="/" style={{ color: "var(--muted)" }}>
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </main>
  );
}
