"use client";

import { useState } from "react";
import Link from "next/link";

export default function FinancingPage() {
  const [vehiclePrice, setVehiclePrice] = useState(15000);
  const [downPayment, setDownPayment] = useState(2500);
  const [termMonths, setTermMonths] = useState(48);
  const [interestRate, setInterestRate] = useState(6.5);

  const loanAmount = Math.max(0, vehiclePrice - downPayment);
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)
      : loanAmount / termMonths;

  return (
    <main style={{ padding: "50px 0 90px" }}>
      <div className="container" style={{ maxWidth: "980px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="eyebrow">FLEXIBLE AUTO FINANCING</span>
          <h1 className="section-title" style={{ fontSize: "38px", marginBottom: "12px" }}>
            Financing Built Around You
          </h1>
          <p className="section-subtitle" style={{ margin: "auto" }}>
            At Zakaria Auto Group LLC, we partner with prime and subprime lenders to secure competitive rates for every credit profile.
          </p>
        </div>

        {/* Interactive Payment Calculator Card */}
        <div className="glass-panel" style={{ padding: "36px", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
            Payment Calculator
          </h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "28px" }}>
            Estimate your monthly payments based on vehicle price, down payment, and loan terms.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "36px",
              alignItems: "center",
            }}
            className="calc-grid"
          >
            {/* Controls */}
            <div style={{ display: "grid", gap: "18px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label className="input-label" style={{ margin: 0 }}>Vehicle Price</label>
                  <span style={{ color: "#fff", fontWeight: 700 }}>${vehiclePrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="60000"
                  step="500"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label className="input-label" style={{ margin: 0 }}>Down Payment</label>
                  <span style={{ color: "#fff", fontWeight: 700 }}>${downPayment.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="500"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="input-label">Loan Term</label>
                  <select
                    className="select-field"
                    value={termMonths}
                    onChange={(e) => setTermMonths(Number(e.target.value))}
                  >
                    <option value={24}>24 Months (2 yrs)</option>
                    <option value={36}>36 Months (3 yrs)</option>
                    <option value={48}>48 Months (4 yrs)</option>
                    <option value={60}>60 Months (5 yrs)</option>
                    <option value={72}>72 Months (6 yrs)</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Est. APR (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="25"
                    className="input-field"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div
              style={{
                background: "rgba(37, 99, 235, 0.12)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: "16px",
                padding: "32px",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "2px" }}>
                ESTIMATED PAYMENT
              </span>
              <div
                style={{
                  fontSize: "44px",
                  fontWeight: 800,
                  color: "var(--neon-blue)",
                  margin: "8px 0 4px",
                }}
              >
                ${Math.round(monthlyPayment).toLocaleString()}
                <span style={{ fontSize: "16px", color: "var(--muted)", fontWeight: 500 }}>/mo</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "20px" }}>
                Loan Amount: ${loanAmount.toLocaleString()} over {termMonths} months @ {interestRate}% APR
              </p>

              <Link href="/apply" className="btn btn-light" style={{ width: "100%" }}>
                Apply for Pre-Approval →
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Pillar Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          <div className="glass-panel" style={{ padding: "28px" }}>
            <span style={{ fontSize: "28px", display: "block", marginBottom: "12px" }}>⚡</span>
            <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Fast Online Pre-Approval</h3>
            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6 }}>
              Complete our secure 4-step credit application in under 3 minutes without affecting your credit score.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "28px" }}>
            <span style={{ fontSize: "28px", display: "block", marginBottom: "12px" }}>🤝</span>
            <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>All Credit Welcome</h3>
            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6 }}>
              First-time buyer? Past credit challenges? We work with national and local lenders who specialize in second chances.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "28px" }}>
            <span style={{ fontSize: "28px", display: "block", marginBottom: "12px" }}>🔍</span>
            <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Transparent Terms</h3>
            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6 }}>
              No hidden fees or unexpected charges. Every finance agreement is explained clearly before signing.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
