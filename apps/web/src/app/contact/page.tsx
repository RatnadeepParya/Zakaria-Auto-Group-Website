"use client";

import { useState, FormEvent } from "react";
import { sendContactMessage } from "../../lib/api";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Phone Formatter: (XXX) XXX-XXXX
  function formatPhone(val: string): string {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setSending(true);
    setError(null);

    try {
      await sendContactMessage({
        firstName,
        lastName,
        phone,
        email,
        message,
      });
      setSentSuccess(true);
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main style={{ padding: "50px 0 90px" }}>
      <div className="container" style={{ maxWidth: "980px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="eyebrow">WE'RE HERE TO HELP</span>
          <h1 className="section-title" style={{ fontSize: "38px", marginBottom: "8px" }}>
            Contact Us
          </h1>
          <p className="section-subtitle" style={{ margin: "auto" }}>
            Have a question or want to schedule a test drive? We're here to help.
          </p>
        </div>

        {/* Top 2-Column Section: Info Card (Left) + Map (Right) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: "24px",
            marginBottom: "32px",
          }}
          className="contact-top-grid"
        >
          {/* Dealership Info Card */}
          <div className="glass-panel" style={{ padding: "32px", display: "grid", gap: "22px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "20px",
                  color: "var(--neon-blue)",
                  flexShrink: 0,
                }}
              >
                ⌖
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#fff", display: "block" }}>Visit Our Showroom</strong>
                <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "2px" }}>
                  706 Roswell St SE<br />Marietta, GA 30060
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "18px",
                  color: "var(--neon-blue)",
                  flexShrink: 0,
                }}
              >
                ☎
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#fff", display: "block" }}>Phone Number</strong>
                <a href="tel:6784013044" style={{ color: "var(--neon-blue)", fontSize: "15px", fontWeight: 600 }}>
                  (678) 401-3044
                </a>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "18px",
                  color: "var(--neon-blue)",
                  flexShrink: 0,
                }}
              >
                ✉
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#fff", display: "block" }}>Direct Email</strong>
                <p style={{ color: "var(--muted)", fontSize: "14px" }}>zakariaautogroup@gmail.com</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "18px",
                  color: "var(--neon-blue)",
                  flexShrink: 0,
                }}
              >
                ◷
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#fff", display: "block" }}>Operating Hours</strong>
                <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "2px", lineHeight: 1.6 }}>
                  Mon – Fri: 10:00 AM – 6:00 PM<br />
                  Saturday: 10:00 AM – 5:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          {/* Map Embed (Right) matching Panel 5 */}
          <div
            className="glass-panel"
            style={{
              overflow: "hidden",
              position: "relative",
              minHeight: "320px",
            }}
          >
            <iframe
              title="Zakaria Auto Group Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-84.538%2C33.945%2C-84.520%2C33.955&amp;layer=mapnik&amp;marker=33.9498%2C-84.5290"
              style={{
                width: "100%",
                height: "100%",
                minHeight: "320px",
                border: "none",
                filter: "invert(90%) hue-rotate(180deg) contrast(1.1)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                background: "rgba(7, 21, 34, 0.88)",
                backdropFilter: "blur(8px)",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.15)",
                fontSize: "12px",
                color: "#fff",
              }}
            >
              📍 Zakaria Auto Group LLC • 706 Roswell St SE
            </div>
          </div>
        </div>

        {/* Bottom Card: Send Us a Message Form (Matching Mockup Panel 5) */}
        <div className="glass-panel" style={{ padding: "36px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
            Send Us a Message
          </h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "24px" }}>
            Fill out the form below and one of our dedicated customer representatives will get back to you promptly.
          </p>

          {sentSuccess ? (
            <div
              style={{
                padding: "20px",
                background: "rgba(34, 197, 94, 0.15)",
                border: "1px solid rgba(34, 197, 94, 0.4)",
                borderRadius: "10px",
                color: "#4ade80",
                fontSize: "15px",
                lineHeight: 1.6,
              }}
            >
              ✓ <strong>Message Delivered!</strong> Thank you for reaching out to Zakaria Auto Group LLC. We have received your inquiry and our team will get in touch with you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }} className="form-cols">
                <div>
                  <label className="input-label">First Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="input-label">Last Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }} className="form-cols">
                <div>
                  <label className="input-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="input-field"
                    required
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="(678) 555-0100"
                  />
                </div>
                <div>
                  <label className="input-label">Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Message *</label>
                <textarea
                  rows={5}
                  className="textarea-field"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you? Tell us about test drives, trade-ins, or questions..."
                />
              </div>

              {error && <p style={{ color: "#f87171", fontSize: "14px" }}>{error}</p>}

              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sending}
                  style={{ padding: "14px 28px" }}
                >
                  {sending ? "Sending Message..." : "Send Message →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
