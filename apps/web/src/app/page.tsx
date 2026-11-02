"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Vehicle, VehicleFacets } from "../lib/types";
import { getVehicles, getVehicleFacets } from "../lib/api";
import VehicleCard from "../components/VehicleCard";
import VehicleModal from "../components/VehicleModal";

export default function HomePage() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [facets, setFacets] = useState<VehicleFacets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getVehicles("limit=6"),
      getVehicleFacets(),
    ])
      .then(([vehiclesRes, facetsRes]) => {
        setFeaturedVehicles(vehiclesRes.data || []);
        setFacets(facetsRes.data || null);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load database records.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      {/* ----------------- SECTION 1: HERO (Matching Mockup Panel 1) ----------------- */}
      <section
        style={{
          position: "relative",
          minHeight: "600px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          padding: "60px 0 30px",
          background: "radial-gradient(ellipse at 75% 30%, rgba(30, 64, 110, 0.45) 0%, rgba(7, 21, 34, 0) 70%)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: "40px",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* Left Copy */}
            <div>
              <span className="eyebrow">PRE-OWNED VEHICLES</span>
              <h1 className="section-title" style={{ fontSize: "clamp(38px, 5.5vw, 62px)", marginBottom: "18px" }}>
                Quality Cars,<br />
                <span style={{ color: "#ffffff" }}>Transparent Deals</span>
              </h1>
              <p className="section-subtitle" style={{ marginBottom: "28px", lineHeight: 1.7 }}>
                A better car buying experience — premium selection, competitive prices, and a team you can trust in Marietta, GA.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "40px" }}>
                <Link href="/inventory" className="btn btn-light" style={{ padding: "14px 26px" }}>
                  Browse Inventory →
                </Link>
                <Link href="/apply" className="btn btn-ghost" style={{ padding: "14px 26px" }}>
                  Apply for Financing
                </Link>
              </div>
            </div>

            {/* Right Visual (Showroom car matching mockup) */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "relative",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85"
                  alt="BMW 4 Series in showroom"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(7,21,34,0.1) 0%, rgba(7,21,34,0.6) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    background: "rgba(7,21,34,0.75)",
                    backdropFilter: "blur(6px)",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    fontSize: "11px",
                    letterSpacing: "2px",
                    color: "var(--neon-blue)",
                    fontWeight: 700,
                  }}
                >
                  FEATURED INVENTORY
                </div>
              </div>
            </div>
          </div>

          {/* 3 Value Proposition Glass Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
              marginTop: "50px",
            }}
          >
            <div className="glass-panel" style={{ padding: "24px", display: "flex", gap: "16px", alignItems: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "22px",
                }}
              >
                🚗
              </div>
              <div>
                <strong style={{ display: "block", fontSize: "16px", color: "#fff" }}>Quality Vehicles</strong>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>Inspected & Verified</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "24px", display: "flex", gap: "16px", alignItems: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "22px",
                }}
              >
                🛡️
              </div>
              <div>
                <strong style={{ display: "block", fontSize: "16px", color: "#fff" }}>Flexible Financing</strong>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>Multiple Lenders</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "24px", display: "flex", gap: "16px", alignItems: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "22px",
                }}
              >
                🤝
              </div>
              <div>
                <strong style={{ display: "block", fontSize: "16px", color: "#fff" }}>Trusted Dealer</strong>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>Customer Focused</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Stats Row (Live from Database) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              marginTop: "30px",
              textAlign: "center",
              padding: "20px 0",
            }}
          >
            <div>
              <strong style={{ fontSize: "36px", fontWeight: 800, color: "#fff", display: "block" }}>
                {facets ? `${facets.total}+` : "..."}
              </strong>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Vehicles In Stock</span>
            </div>
            <div>
              <strong style={{ fontSize: "36px", fontWeight: 800, color: "#fff", display: "block" }}>100%</strong>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Transparent Pricing</span>
            </div>
            <div>
              <strong style={{ fontSize: "36px", fontWeight: 800, color: "#fff", display: "block" }}>5★</strong>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Customer Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 2: FIND YOUR CAR (Matching Mockup Panel 4) ----------------- */}
      <section style={{ padding: "70px 0", background: "rgba(5, 16, 26, 0.5)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              alignItems: "center",
              marginBottom: "50px",
            }}
            className="find-grid"
          >
            {/* Visual vehicle */}
            <div style={{ position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80"
                alt="Silver executive car"
                style={{ width: "100%", borderRadius: "16px", border: "1px solid var(--glass-border)" }}
              />
            </div>

            {/* Prompt & Contact */}
            <div>
              <span className="eyebrow">PERSONALIZED INVENTORY FINDER</span>
              <h2 className="section-title" style={{ fontSize: "32px", marginBottom: "14px" }}>
                Let Us Help You Find Your Car
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "15px", marginBottom: "24px", lineHeight: 1.6 }}>
                Looking for something specific? Let our team know your preferred make, model, or price range and we can help you track down the perfect match.
              </p>
              <Link href="/contact" className="btn btn-light">
                Contact Us →
              </Link>
            </div>
          </div>

          {/* Quick Filters: By Body Type & By Make (Live from Database) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "30px", marginBottom: "40px" }} className="category-grid">
            {/* Search By Body Type */}
            <div className="glass-panel" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "var(--muted)" }}>
                SEARCH BY BODY TYPE
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "14px" }}>
                {(facets?.bodyTypes && facets.bodyTypes.length > 0
                  ? facets.bodyTypes
                  : [
                      { name: "Sedan", count: 0 },
                      { name: "SUV", count: 0 },
                    ]
                ).map((item) => (
                  <Link
                    key={item.name}
                    href={`/inventory?bodyType=${item.name}`}
                    className="glass-card"
                    style={{
                      padding: "18px 12px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "28px" }}>
                      {item.name === "SUV" ? "🚙" : item.name === "Truck" ? "🛻" : item.name === "Coupe" ? "🏎️" : "🚗"}
                    </span>
                    <strong style={{ fontSize: "14px" }}>{item.name}</strong>
                    {item.count > 0 && (
                      <span style={{ color: "var(--neon-blue)", fontSize: "11px" }}>{item.count} in stock</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search By Make */}
            <div className="glass-panel" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "var(--muted)" }}>
                SEARCH BY MAKE
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {facets?.makes && facets.makes.length > 0 ? (
                  facets.makes.map((item) => (
                    <Link
                      key={item.name}
                      href={`/inventory?make=${item.name}`}
                      className="glass-card"
                      style={{
                        padding: "10px 18px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      <span>{item.name}</span>
                      <span style={{ color: "var(--neon-blue)", fontSize: "12px" }}>({item.count})</span>
                    </Link>
                  ))
                ) : (
                  <span style={{ color: "var(--muted)", fontSize: "13px" }}>Loading available makes...</span>
                )}
              </div>
            </div>
          </div>

          {/* Financing Promo Banner matching Mockup */}
          <div
            className="glass-panel"
            style={{
              padding: "28px 36px",
              background: "linear-gradient(90deg, rgba(37, 99, 235, 0.15) 0%, rgba(14, 29, 44, 0.8) 100%)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", gap: "20px", alignItems: "center", maxWidth: "680px" }}>
              <div style={{ fontSize: "36px" }}>💳</div>
              <div>
                <strong style={{ fontSize: "17px", color: "#fff", display: "block", marginBottom: "4px" }}>
                  With relationships with multiple lenders, we can get you financed.
                </strong>
                <p style={{ fontSize: "13px", color: "var(--muted)" }}>
                  Good Credit, Bad Credit, First Time Buyer? Our lenders work with all types of scores and situations.
                </p>
              </div>
            </div>

            <Link href="/apply" className="btn btn-light">
              Apply for Credit Today →
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 3: FEATURED VEHICLES PREVIEW (Live from Database) ----------------- */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "36px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <span className="eyebrow">HAND-PICKED SELECTION</span>
              <h2 className="section-title">Featured Inventory</h2>
              <p className="section-subtitle">
                Explore popular pre-owned cars, SUVs, and trucks ready for immediate delivery.
              </p>
            </div>
            <Link href="/inventory" className="btn btn-outline-blue">
              View All Inventory ({facets ? facets.total : featuredVehicles.length}) →
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: "60px 0", textAlign: "center", color: "var(--muted)" }}>
              Loading vehicles from inventory database...
            </div>
          ) : error ? (
            <div style={{ padding: "40px", textAlign: "center", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "12px", color: "#f87171" }}>
              <p style={{ marginBottom: "12px" }}>{error}</p>
              <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ padding: "8px 16px" }}>
                Retry
              </button>
            </div>
          ) : featuredVehicles.length === 0 ? (
            <div style={{ padding: "60px 0", textAlign: "center", color: "var(--muted)" }}>
              No vehicles currently listed. Check back soon!
            </div>
          ) : (
            <div className="vehicle-grid">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onSelect={(v) => setSelectedVehicle(v)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      {selectedVehicle && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </main>
  );
}
