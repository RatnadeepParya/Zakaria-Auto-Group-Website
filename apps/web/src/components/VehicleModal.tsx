"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Vehicle } from "../lib/types";
import { formatCurrency, formatMileage, sendContactMessage } from "../lib/api";

interface VehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export default function VehicleModal({ vehicle, onClose }: VehicleModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    `Hi, I am interested in this ${vehicle.year} ${vehicle.make} ${vehicle.model} (VIN: ${vehicle.vin}). Please let me know if it is still available.`
  );
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

    const parts = fullName.trim().split(" ");
    const firstName = parts[0] || "Interested";
    const lastName = parts.slice(1).join(" ") || "Customer";

    try {
      await sendContactMessage({
        firstName,
        lastName,
        email,
        phone,
        message,
        vehicleId: vehicle.id,
      });
      setSentSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send inquiry.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 10,
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            fontSize: "18px",
          }}
        >
          ✕
        </button>

        {/* Vehicle Image */}
        <div style={{ position: "relative", height: "300px", width: "100%", background: "#071522" }}>
          <img
            src={vehicle.imageUrl || "https://images.unsplash.com/photo-1555215695-3004980ad54e"}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Body Content */}
        <div style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
            <div>
              <span className="eyebrow">{vehicle.bodyType} • PRE-OWNED</span>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "4px" }}>
                VIN: <code style={{ color: "var(--neon-blue)" }}>{vehicle.vin}</code> • Mileage: {formatMileage(vehicle.mileage)}
              </p>
            </div>
            <div>
              <span className="price-tag" style={{ fontSize: "28px" }}>
                {formatCurrency(vehicle.priceCents)}
              </span>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px",
              margin: "24px 0",
              padding: "16px",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "10px",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div>
              <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>TRANSMISSION</span>
              <strong style={{ fontSize: "14px" }}>{vehicle.transmission}</strong>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>DRIVETRAIN</span>
              <strong style={{ fontSize: "14px" }}>{vehicle.drivetrain}</strong>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>FUEL TYPE</span>
              <strong style={{ fontSize: "14px" }}>{vehicle.fuelType}</strong>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>EXTERIOR</span>
              <strong style={{ fontSize: "14px" }}>{vehicle.exteriorColor || "Factory Standard"}</strong>
            </div>
          </div>

          {/* Description */}
          {vehicle.description && (
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "6px" }}>Vehicle Overview</h4>
              <p style={{ fontSize: "14px", color: "#e2e8f0", lineHeight: 1.6 }}>{vehicle.description}</p>
            </div>
          )}

          {/* Lead Capture Enquiry Form */}
          <div
            style={{
              padding: "20px",
              background: "rgba(14, 29, 44, 0.6)",
              borderRadius: "12px",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              marginTop: "20px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>
              Inquire About This Vehicle
            </h3>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>
              Schedule a test drive or speak with a sales advisor at our Marietta, GA dealership.
            </p>

            {sentSuccess ? (
              <div
                style={{
                  padding: "16px",
                  background: "rgba(34, 197, 94, 0.15)",
                  border: "1px solid rgba(34, 197, 94, 0.4)",
                  borderRadius: "8px",
                  color: "#4ade80",
                  fontSize: "14px",
                }}
              >
                ✓ Thank you! Your inquiry has been sent to our sales team. We will call or email you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="input-label">Full Name *</label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Customer"
                    />
                  </div>
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
                </div>

                <div>
                  <label className="input-label">Email Address *</label>
                  <input
                    type="email"
                    className="input-field"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                  />
                </div>

                <div>
                  <label className="input-label">Message</label>
                  <textarea
                    rows={3}
                    className="textarea-field"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                {error && <p style={{ color: "#f87171", fontSize: "13px" }}>{error}</p>}

                <div style={{ display: "flex", gap: "12px", marginTop: "6px", alignItems: "center" }}>
                  <button type="submit" className="btn btn-primary" disabled={sending}>
                    {sending ? "Sending Inquiry..." : "Submit Inquiry →"}
                  </button>

                  <Link
                    href={`/apply?vehicleId=${vehicle.id}`}
                    className="btn btn-outline-blue"
                    onClick={onClose}
                  >
                    Apply for Financing
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
