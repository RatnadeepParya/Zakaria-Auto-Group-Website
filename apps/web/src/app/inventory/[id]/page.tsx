"use client";

import { useEffect, useState, use, FormEvent } from "react";
import Link from "next/link";
import { Vehicle } from "../../../lib/types";
import { getVehicle, formatCurrency, formatMileage, sendContactMessage } from "../../../lib/api";

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inquiry form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    getVehicle(resolvedParams.id)
      .then((res) => {
        setVehicle(res.data);
        setMessage(
          `Hi, I am interested in this ${res.data.year} ${res.data.make} ${res.data.model} (VIN: ${res.data.vin}). Please let me know if it is available for a test drive.`
        );
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Vehicle not found.");
      })
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  // Phone Formatter: (XXX) XXX-XXXX
  function formatPhone(val: string): string {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  async function handleInquiry(e: FormEvent) {
    e.preventDefault();
    if (!vehicle) return;
    if (phone.replace(/\D/g, "").length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    setSending(true);

    const parts = fullName.trim().split(" ");
    const firstName = parts[0] || "Interested";
    const lastName = parts.slice(1).join(" ") || "Buyer";

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
      alert(err instanceof Error ? err.message : "Failed to submit enquiry.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: "80px 0", textAlign: "center", color: "var(--muted)" }}>
        Loading vehicle details...
      </main>
    );
  }

  if (error || !vehicle) {
    return (
      <main className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", color: "#fff", marginBottom: "14px" }}>Vehicle Not Found</h1>
        <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
          The vehicle you are looking for may have been sold or removed from inventory.
        </p>
        <Link href="/inventory" className="btn btn-primary">
          Back to Inventory
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 0 80px" }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: "20px", fontSize: "13px", color: "var(--muted)" }}>
          <Link href="/">Home</Link> / <Link href="/inventory">Inventory</Link> /{" "}
          <span style={{ color: "#fff" }}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </span>
        </div>

        {/* 2-Column Main Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "40px",
            alignItems: "flex-start",
          }}
          className="vehicle-detail-grid"
        >
          {/* Left Column: Photos & Details */}
          <div>
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid var(--glass-border)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                background: "#0c1b2b",
                marginBottom: "24px",
              }}
            >
              <img
                src={vehicle.imageUrl || "https://images.unsplash.com/photo-1555215695-3004980ad54e"}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            {/* Specifications Card */}
            <div className="glass-panel" style={{ padding: "28px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "18px" }}>
                Vehicle Specifications
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  fontSize: "14px",
                }}
              >
                <div>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "12px" }}>VIN</span>
                  <strong>{vehicle.vin}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "12px" }}>MILEAGE</span>
                  <strong>{formatMileage(vehicle.mileage)}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "12px" }}>BODY TYPE</span>
                  <strong>{vehicle.bodyType}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "12px" }}>TRANSMISSION</span>
                  <strong>{vehicle.transmission}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "12px" }}>DRIVETRAIN</span>
                  <strong>{vehicle.drivetrain}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "12px" }}>FUEL TYPE</span>
                  <strong>{vehicle.fuelType}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "12px" }}>EXTERIOR COLOR</span>
                  <strong>{vehicle.exteriorColor || "Factory Standard"}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "12px" }}>INTERIOR COLOR</span>
                  <strong>{vehicle.interiorColor || "Premium Cloth/Leather"}</strong>
                </div>
              </div>
            </div>

            {/* Overview & Description */}
            {vehicle.description && (
              <div className="glass-panel" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "14px" }}>
                  Dealer Description
                </h3>
                <p style={{ color: "#d1dce4", lineHeight: 1.7, fontSize: "15px" }}>{vehicle.description}</p>
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Inquiry Form */}
          <div>
            <div className="glass-panel" style={{ padding: "32px", position: "sticky", top: "90px" }}>
              <span className="eyebrow">{vehicle.bodyType} • PRE-OWNED</span>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "4px 0 10px" }}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>

              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", margin: "14px 0 24px" }}>
                <span className="price-tag" style={{ fontSize: "34px" }}>
                  {formatCurrency(vehicle.priceCents)}
                </span>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>Online Price</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginBottom: "28px" }}>
                <Link href={`/apply?vehicleId=${vehicle.id}`} className="btn btn-primary" style={{ padding: "14px" }}>
                  Apply for Financing Online →
                </Link>
                <a href="tel:6784013044" className="btn btn-ghost" style={{ padding: "14px" }}>
                  Call Dealership: (678) 401-3044
                </a>
              </div>

              {/* Inquiry Form */}
              <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "24px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
                  Schedule a Test Drive
                </h4>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "18px" }}>
                  Send us your contact info to confirm availability at our Marietta, GA location.
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
                    ✓ Thank you! Your request has been sent. A Zakaria Auto Group specialist will contact you right away.
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} style={{ display: "grid", gap: "12px" }}>
                    <div>
                      <label className="input-label">Full Name *</label>
                      <input
                        type="text"
                        className="input-field"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
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
                        placeholder="(678) 000-0000"
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
                        placeholder="you@email.com"
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
                    <button type="submit" className="btn btn-light" disabled={sending} style={{ marginTop: "6px" }}>
                      {sending ? "Sending..." : "Submit Test Drive Request →"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
