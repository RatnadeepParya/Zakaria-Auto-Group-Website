"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Vehicle, VehicleFacets } from "../../lib/types";
import { getVehicles, getVehicleFacets } from "../../lib/api";
import VehicleCard from "../../components/VehicleCard";
import VehicleModal from "../../components/VehicleModal";

function InventoryContent() {
  const searchParams = useSearchParams();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [facets, setFacets] = useState<VehicleFacets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states matching Mockup Panel 2
  const [make, setMake] = useState(searchParams.get("make") || "");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [bodyType, setBodyType] = useState(searchParams.get("bodyType") || "");
  const [maxPrice, setMaxPrice] = useState("50000");
  const [drivetrain, setDrivetrain] = useState("");
  const [transmission, setTransmission] = useState("");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");

  // Load dynamic facets from database on mount
  useEffect(() => {
    getVehicleFacets()
      .then((res) => {
        setFacets(res.data);
        if (res.data.priceRange.max > 0) {
          setMaxPrice(String(Math.ceil(res.data.priceRange.max)));
        }
      })
      .catch(() => {
        // Facets error handled silently; fallback to general filter controls
      });
  }, []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    if (year) params.set("year", year);
    if (bodyType) params.set("bodyType", bodyType);
    if (maxPrice && Number(maxPrice) < 50000) params.set("maxPrice", maxPrice);
    if (drivetrain) params.set("drivetrain", drivetrain);
    if (transmission) params.set("transmission", transmission);
    if (search.trim()) params.set("search", search.trim());
    if (sort) params.set("sort", sort);
    return params.toString();
  }, [make, model, year, bodyType, maxPrice, drivetrain, transmission, search, sort]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getVehicles(queryString)
      .then((res) => {
        setVehicles(res.data || []);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load inventory from database.");
        setVehicles([]);
      })
      .finally(() => setLoading(false));
  }, [queryString]);

  function resetFilters() {
    setMake("");
    setModel("");
    setYear("");
    setBodyType("");
    setMaxPrice(facets ? String(Math.ceil(facets.priceRange.max)) : "50000");
    setDrivetrain("");
    setTransmission("");
    setSearch("");
    setSort("newest");
  }

  return (
    <main style={{ padding: "40px 0 80px" }}>
      <div className="container">
        {/* Page Heading */}
        <div style={{ marginBottom: "32px" }}>
          <span className="eyebrow">OUR INVENTORY</span>
          <h1 className="section-title">Our Inventory</h1>
          <p className="section-subtitle">
            Browse our current selection of quality pre-owned vehicles.
          </p>
        </div>

        {/* 2-Column Inventory Layout: Sidebar + Grid */}
        <div
          className="inventory-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "32px",
            alignItems: "flex-start",
          }}
        >
          {/* ----------------- LEFT FILTER SIDEBAR (Matching Panel 2) ----------------- */}
          <aside
            className="glass-panel filter-sidebar"
            style={{
              padding: "24px",
              position: "sticky",
              top: "90px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "16px" }}>
                <span>🔍</span> Filter Your Search
              </div>
              <button
                onClick={resetFilters}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--neon-blue)",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Reset Filters
              </button>
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              {/* Keyword Search */}
              <div>
                <label className="input-label">Keywords</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Leather, Turbo, GT..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Make Filter (Live from DB facets) */}
              <div>
                <label className="input-label">Make</label>
                <select className="select-field" value={make} onChange={(e) => setMake(e.target.value)}>
                  <option value="">All Makes</option>
                  {facets?.makes?.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} ({m.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Body Type Filter (Live from DB facets) */}
              <div>
                <label className="input-label">Body Type</label>
                <select className="select-field" value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
                  <option value="">All Body Types</option>
                  {facets?.bodyTypes?.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name} ({b.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="input-label">Year</label>
                <select className="select-field" value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">All Years</option>
                  {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label className="input-label" style={{ margin: 0 }}>Price Range</label>
                  <span style={{ fontSize: "12px", color: "var(--neon-blue)", fontWeight: 700 }}>
                    Up to ${Number(maxPrice).toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max={facets?.priceRange?.max ? Math.max(50000, facets.priceRange.max) : 50000}
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>
                  <span>$5,000</span>
                  <span>${Number(facets?.priceRange?.max ? Math.max(50000, facets.priceRange.max) : 50000).toLocaleString()}</span>
                </div>
              </div>

              {/* Drivetrain Filter */}
              <div>
                <label className="input-label">Drivetrain</label>
                <select className="select-field" value={drivetrain} onChange={(e) => setDrivetrain(e.target.value)}>
                  <option value="">All Drivetrains</option>
                  <option value="AWD">AWD</option>
                  <option value="FWD">FWD</option>
                  <option value="4WD">4WD</option>
                  <option value="RWD">RWD</option>
                </select>
              </div>

              {/* Transmission Filter */}
              <div>
                <label className="input-label">Transmission</label>
                <select className="select-field" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                  <option value="">All Transmissions</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              {/* Reset Button */}
              <button
                className="btn btn-ghost"
                style={{ width: "100%", marginTop: "10px", fontSize: "13px" }}
                onClick={resetFilters}
              >
                ⟲ Reset All Filters
              </button>
            </div>
          </aside>

          {/* ----------------- RIGHT MAIN VEHICLE RESULTS ----------------- */}
          <div>
            {/* Top Results Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "14px",
              }}
            >
              <div style={{ fontSize: "15px", color: "#fff", fontWeight: 600 }}>
                {vehicles.length} Vehicles Found
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {/* Sort Dropdown */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", color: "var(--muted)" }}>Sort By:</span>
                  <select
                    className="select-field"
                    style={{ padding: "6px 12px", width: "auto", fontSize: "13px" }}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="newest">Newest Arrival</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="mileage_asc">Mileage: Low to High</option>
                  </select>
                </div>

                {/* Grid / List View Toggle */}
                <div
                  style={{
                    display: "flex",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "6px",
                    padding: "2px",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <button
                    onClick={() => setViewMode("grid")}
                    style={{
                      background: viewMode === "grid" ? "rgba(255,255,255,0.15)" : "transparent",
                      border: "none",
                      color: viewMode === "grid" ? "#fff" : "var(--muted)",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    aria-label="Grid View"
                  >
                    ⊞
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    style={{
                      background: viewMode === "list" ? "rgba(255,255,255,0.15)" : "transparent",
                      border: "none",
                      color: viewMode === "list" ? "#fff" : "var(--muted)",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    aria-label="List View"
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>

            {/* Loading or Empty State */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
                Loading inventory from database...
              </div>
            ) : error ? (
              <div
                className="glass-panel"
                style={{ textAlign: "center", padding: "50px 20px", color: "#f87171" }}
              >
                <p style={{ marginBottom: "14px" }}>{error}</p>
                <button className="btn btn-primary" onClick={resetFilters}>
                  Retry Query
                </button>
              </div>
            ) : vehicles.length === 0 ? (
              <div
                className="glass-panel"
                style={{ textAlign: "center", padding: "60px 20px" }}
              >
                <span style={{ fontSize: "40px", display: "block", marginBottom: "12px" }}>🔍</span>
                <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>
                  No vehicles matched your current filters
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>
                  Try loosening your search criteria or resetting filters to view all available cars.
                </p>
                <button className="btn btn-primary" onClick={resetFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "vehicle-grid" : "vehicle-list"} style={viewMode === "list" ? { display: "grid", gap: "16px" } : {}}>
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onSelect={(v) => setSelectedVehicle(v)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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

export default function InventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: "80px 0", textAlign: "center", color: "var(--muted)" }}>
          Loading vehicle inventory...
        </div>
      }
    >
      <InventoryContent />
    </Suspense>
  );
}
