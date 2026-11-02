"use client";

import { useState } from "react";
import Link from "next/link";
import { Vehicle } from "../lib/types";
import { formatCurrency, formatMileage } from "../lib/api";

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect?: (vehicle: Vehicle) => void;
}

export default function VehicleCard({ vehicle, onSelect }: VehicleCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80";

  return (
    <article
      className="glass-card"
      style={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Image Container with overlay badges */}
      <div
        style={{
          position: "relative",
          height: "200px",
          width: "100%",
          background: "#0c1b2b",
          cursor: "pointer",
        }}
        onClick={() => onSelect && onSelect(vehicle)}
      >
        <img
          src={vehicle.imageUrl || fallbackImage}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          loading="lazy"
        />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          aria-label={isFavorite ? "Remove from saved" : "Save vehicle"}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "rgba(7, 21, 34, 0.7)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: isFavorite ? "#ef4444" : "rgba(255, 255, 255, 0.7)",
            transition: "all 0.2s",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Featured / Status Pill */}
        {vehicle.featured && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "rgba(37, 99, 235, 0.9)",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "1px",
              padding: "4px 8px",
              borderRadius: "4px",
              textTransform: "uppercase",
            }}
          >
            Featured
          </span>
        )}
      </div>

      {/* Info Body */}
      <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
          <div>
            <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>
              {vehicle.year}
            </span>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.25,
                margin: "2px 0 6px",
                cursor: "pointer",
              }}
              onClick={() => onSelect && onSelect(vehicle)}
            >
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="price-tag">{formatCurrency(vehicle.priceCents)}</span>
          </div>
        </div>

        <div style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 14px" }}>
          {formatMileage(vehicle.mileage)}
        </div>

        {/* Specification Badges matching mockup */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "auto" }}>
          <span className="spec-badge">
            <span style={{ color: "var(--neon-blue)" }}>•</span> {vehicle.transmission || "Automatic"}
          </span>
          <span className="spec-badge">
            <span style={{ color: "var(--neon-blue)" }}>•</span> {vehicle.fuelType || "Gasoline"}
          </span>
          <span className="spec-badge">
            <span style={{ color: "var(--neon-blue)" }}>•</span> {vehicle.drivetrain || "FWD"}
          </span>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <button
            className="btn btn-ghost"
            style={{ padding: "8px 12px", fontSize: "12px" }}
            onClick={() => onSelect && onSelect(vehicle)}
          >
            Quick View
          </button>
          <Link
            href={`/inventory/${vehicle.id}`}
            className="btn btn-primary"
            style={{ padding: "8px 12px", fontSize: "12px" }}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
