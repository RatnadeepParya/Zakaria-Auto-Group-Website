"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Vehicle, ContactMessage, CreditApplication, DashboardStats } from "../../lib/types";
import { apiRequest, formatCurrency, formatMileage } from "../../lib/api";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"inventory" | "messages" | "applications">("inventory");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [applications, setApplications] = useState<CreditApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Add / Edit Vehicle Modal State
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    vin: "",
    make: "",
    model: "",
    year: 2020,
    price: 15000,
    mileage: 65000,
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    drivetrain: "FWD",
    exteriorColor: "Silver",
    interiorColor: "Black",
    imageUrl: "",
    description: "",
    featured: false,
    status: "AVAILABLE",
  });
  const [savingVehicle, setSavingVehicle] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [statsRes, vehiclesRes, messagesRes, appsRes] = await Promise.all([
        apiRequest<{ data: DashboardStats }>("/api/admin/stats"),
        apiRequest<{ data: Vehicle[] }>("/api/vehicles?limit=50"),
        apiRequest<{ data: ContactMessage[] }>("/api/contact?limit=50"),
        apiRequest<{ data: CreditApplication[] }>("/api/applications?limit=50"),
      ]);

      setStats(statsRes.data);
      setVehicles(vehiclesRes.data);
      setMessages(messagesRes.data);
      setApplications(appsRes.data);
    } catch {
      setAuthError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  }

  // Vehicle Status Change
  async function handleVehicleStatusChange(id: string, newStatus: string) {
    try {
      await apiRequest(`/api/vehicles/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: newStatus as any } : v))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update vehicle status");
    }
  }

  // Delete Vehicle
  async function handleDeleteVehicle(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) return;
    try {
      await apiRequest(`/api/vehicles/${id}`, { method: "DELETE" });
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete vehicle");
    }
  }

  // Save Vehicle (Create or Edit)
  async function handleSaveVehicle(e: FormEvent) {
    e.preventDefault();
    setSavingVehicle(true);
    try {
      const payload = {
        ...vehicleForm,
        year: Number(vehicleForm.year),
        priceCents: Math.round(Number(vehicleForm.price) * 100),
        mileage: Number(vehicleForm.mileage),
      };

      if (editingVehicleId) {
        await apiRequest(`/api/vehicles/${editingVehicleId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/api/vehicles", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setShowVehicleModal(false);
      setEditingVehicleId(null);
      await loadDashboardData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save vehicle");
    } finally {
      setSavingVehicle(false);
    }
  }

  function openEditModal(v: Vehicle) {
    setEditingVehicleId(v.id);
    setVehicleForm({
      vin: v.vin,
      make: v.make,
      model: v.model,
      year: v.year,
      price: v.priceCents / 100,
      mileage: v.mileage,
      bodyType: v.bodyType,
      transmission: v.transmission,
      fuelType: v.fuelType,
      drivetrain: v.drivetrain,
      exteriorColor: v.exteriorColor || "",
      interiorColor: v.interiorColor || "",
      imageUrl: v.imageUrl || "",
      description: v.description || "",
      featured: v.featured,
      status: v.status,
    });
    setShowVehicleModal(true);
  }

  function openCreateModal() {
    setEditingVehicleId(null);
    setVehicleForm({
      vin: "",
      make: "",
      model: "",
      year: 2020,
      price: 15000,
      mileage: 65000,
      bodyType: "Sedan",
      transmission: "Automatic",
      fuelType: "Gasoline",
      drivetrain: "FWD",
      exteriorColor: "",
      interiorColor: "",
      imageUrl: "",
      description: "",
      featured: false,
      status: "AVAILABLE",
    });
    setShowVehicleModal(true);
  }

  // Message Status Update
  async function handleMessageStatusChange(id: string, newStatus: string) {
    try {
      await apiRequest(`/api/contact/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus as any } : m))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update message status");
    }
  }

  // Application Status Update
  async function handleAppStatusChange(id: string, newStatus: string) {
    try {
      await apiRequest(`/api/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus as any } : a))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update application status");
    }
  }

  if (loading) {
    return (
      <main style={{ padding: "80px 0", textAlign: "center", color: "var(--muted)" }}>
        Loading dealer dashboard...
      </main>
    );
  }

  if (authError) {
    return (
      <main className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", color: "#fff", marginBottom: "12px" }}>
          Administrator Sign In Required
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
          You must be logged in as an authorized Zakaria Auto Group administrator to access this area.
        </p>
        <Link href="/login" className="btn btn-primary">
          Sign In to Portal →
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 0 80px" }}>
      <div className="container">
        {/* Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <span className="eyebrow">DEALERSHIP MANAGEMENT CONSOLE</span>
            <h1 className="section-title" style={{ fontSize: "32px" }}>
              Operations Dashboard
            </h1>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <Link href="/" target="_blank" className="btn btn-ghost" style={{ fontSize: "13px" }}>
              View Live Website ↗
            </Link>
            <button onClick={handleLogout} className="btn btn-light" style={{ fontSize: "13px" }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* KPI Metrics Row */}
        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
              marginBottom: "36px",
            }}
          >
            <div className="glass-panel" style={{ padding: "20px" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>TOTAL INVENTORY</span>
              <strong style={{ display: "block", fontSize: "28px", color: "#fff", margin: "4px 0" }}>
                {stats.inventory.total}
              </strong>
              <span style={{ fontSize: "12px", color: "#4ade80" }}>{stats.inventory.available} Available</span>
            </div>

            <div className="glass-panel" style={{ padding: "20px" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>SOLD VEHICLES</span>
              <strong style={{ display: "block", fontSize: "28px", color: "#fff", margin: "4px 0" }}>
                {stats.inventory.sold}
              </strong>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>Completed deliveries</span>
            </div>

            <div className="glass-panel" style={{ padding: "20px" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>NEW LEADS & INQUIRIES</span>
              <strong style={{ display: "block", fontSize: "28px", color: "var(--neon-blue)", margin: "4px 0" }}>
                {stats.messages.new}
              </strong>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>{stats.messages.total} total inquiries</span>
            </div>

            <div className="glass-panel" style={{ padding: "20px" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>CREDIT APPLICATIONS</span>
              <strong style={{ display: "block", fontSize: "28px", color: "#f59e0b", margin: "4px 0" }}>
                {stats.applications.submitted}
              </strong>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>{stats.applications.total} submitted</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            borderBottom: "1px solid var(--glass-border)",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={() => setActiveTab("inventory")}
            style={{
              padding: "10px 18px",
              background: activeTab === "inventory" ? "rgba(255,255,255,0.1)" : "transparent",
              color: activeTab === "inventory" ? "#fff" : "var(--muted)",
              border: "none",
              borderBottom: activeTab === "inventory" ? "2px solid var(--neon-blue)" : "none",
              borderRadius: "6px 6px 0 0",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Vehicle Inventory ({vehicles.length})
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            style={{
              padding: "10px 18px",
              background: activeTab === "messages" ? "rgba(255,255,255,0.1)" : "transparent",
              color: activeTab === "messages" ? "#fff" : "var(--muted)",
              border: "none",
              borderBottom: activeTab === "messages" ? "2px solid var(--neon-blue)" : "none",
              borderRadius: "6px 6px 0 0",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Customer Inquiries ({messages.length})
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            style={{
              padding: "10px 18px",
              background: activeTab === "applications" ? "rgba(255,255,255,0.1)" : "transparent",
              color: activeTab === "applications" ? "#fff" : "var(--muted)",
              border: "none",
              borderBottom: activeTab === "applications" ? "2px solid var(--neon-blue)" : "none",
              borderRadius: "6px 6px 0 0",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Credit Applications ({applications.length})
          </button>
        </div>

        {/* ---------------- TAB 1: VEHICLE INVENTORY CRUD ---------------- */}
        {activeTab === "inventory" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", color: "#fff" }}>Lot Inventory</h2>
              <button onClick={openCreateModal} className="btn btn-primary" style={{ fontSize: "13px" }}>
                + Add New Vehicle
              </button>
            </div>

            <div className="glass-panel" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--glass-border)", color: "var(--muted)" }}>
                    <th style={{ padding: "14px 18px" }}>Vehicle</th>
                    <th style={{ padding: "14px 18px" }}>VIN</th>
                    <th style={{ padding: "14px 18px" }}>Price</th>
                    <th style={{ padding: "14px 18px" }}>Mileage</th>
                    <th style={{ padding: "14px 18px" }}>Status</th>
                    <th style={{ padding: "14px 18px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <img
                            src={v.imageUrl || "https://images.unsplash.com/photo-1555215695-3004980ad54e"}
                            alt={v.model}
                            style={{ width: "48px", height: "36px", objectFit: "cover", borderRadius: "4px" }}
                          />
                          <div>
                            <strong style={{ color: "#fff", display: "block" }}>
                              {v.year} {v.make} {v.model}
                            </strong>
                            <span style={{ fontSize: "12px", color: "var(--muted)" }}>{v.bodyType}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px", fontFamily: "monospace", fontSize: "12px", color: "var(--neon-blue)" }}>
                        {v.vin}
                      </td>
                      <td style={{ padding: "14px 18px", fontWeight: 700, color: "#fff" }}>
                        {formatCurrency(v.priceCents)}
                      </td>
                      <td style={{ padding: "14px 18px", color: "var(--muted)" }}>
                        {formatMileage(v.mileage)}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <select
                          className="select-field"
                          style={{ padding: "4px 8px", fontSize: "12px", width: "auto" }}
                          value={v.status}
                          onChange={(e) => handleVehicleStatusChange(v.id, e.target.value)}
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="RESERVED">Reserved</option>
                          <option value="SOLD">Sold</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </td>
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <button
                          onClick={() => openEditModal(v)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--neon-blue)",
                            marginRight: "12px",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(v.id, `${v.year} ${v.make} ${v.model}`)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#f87171",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: INQUIRIES & LEADS ---------------- */}
        {activeTab === "messages" && (
          <div>
            <h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "20px" }}>Customer Inquiries</h2>

            <div className="glass-panel" style={{ padding: "20px" }}>
              {messages.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--muted)", padding: "40px 0" }}>No customer inquiries yet.</p>
              ) : (
                <div style={{ display: "grid", gap: "16px" }}>
                  {messages.map((m) => (
                    <article
                      key={m.id}
                      style={{
                        padding: "16px 20px",
                        background: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "10px",
                        border: "1px solid var(--glass-border)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                        <div>
                          <strong style={{ fontSize: "16px", color: "#fff" }}>
                            {m.firstName} {m.lastName}
                          </strong>
                          <span style={{ fontSize: "13px", color: "var(--muted)", marginLeft: "10px" }}>
                            {m.email} {m.phone ? `• ${m.phone}` : ""}
                          </span>
                          {m.vehicle && (
                            <span style={{ display: "block", fontSize: "12px", color: "var(--neon-blue)", marginTop: "2px" }}>
                              Regarding: {m.vehicle.year} {m.vehicle.make} {m.vehicle.model}
                            </span>
                          )}
                        </div>

                        <div>
                          <select
                            className="select-field"
                            style={{ padding: "4px 8px", fontSize: "12px", width: "auto" }}
                            value={m.status}
                            onChange={(e) => handleMessageStatusChange(m.id, e.target.value)}
                          >
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="SPAM">Spam</option>
                          </select>
                        </div>
                      </div>

                      <p style={{ fontSize: "14px", color: "#d1dce4", margin: "12px 0 6px", lineHeight: 1.6 }}>
                        "{m.message}"
                      </p>
                      <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                        Received: {new Date(m.createdAt).toLocaleString()}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: CREDIT APPLICATIONS ---------------- */}
        {activeTab === "applications" && (
          <div>
            <h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "20px" }}>Credit Pre-Approval Applications</h2>

            <div className="glass-panel" style={{ padding: "20px" }}>
              {applications.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--muted)", padding: "40px 0" }}>No credit applications submitted yet.</p>
              ) : (
                <div style={{ display: "grid", gap: "16px" }}>
                  {applications.map((app) => (
                    <article
                      key={app.id}
                      style={{
                        padding: "18px 20px",
                        background: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "10px",
                        border: "1px solid var(--glass-border)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                        <div>
                          <strong style={{ fontSize: "16px", color: "#fff" }}>
                            {app.firstName} {app.lastName}
                          </strong>
                          <span style={{ fontSize: "13px", color: "var(--muted)", marginLeft: "10px" }}>
                            {app.email} • {app.phone}
                          </span>
                          <div style={{ fontSize: "13px", color: "#e2e8f0", marginTop: "4px" }}>
                            Employment: {app.employmentStatus} {app.employerName ? `at ${app.employerName}` : ""} •{" "}
                            Income: ${app.annualIncomeCents ? (app.annualIncomeCents / 100).toLocaleString() : "N/A"}/yr
                          </div>
                          {app.ssnLast4 && (
                            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                              SSN: ***-**-{app.ssnLast4} • State: {app.driversLicenseState || "GA"}
                            </span>
                          )}
                        </div>

                        <div>
                          <select
                            className="select-field"
                            style={{ padding: "4px 8px", fontSize: "12px", width: "auto" }}
                            value={app.status}
                            onChange={(e) => handleAppStatusChange(app.id, e.target.value)}
                          >
                            <option value="SUBMITTED">Submitted</option>
                            <option value="REVIEWING">Reviewing</option>
                            <option value="APPROVED">Approved</option>
                            <option value="DECLINED">Declined</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ marginTop: "10px", fontSize: "11px", color: "var(--muted)" }}>
                        Submitted on {new Date(app.createdAt).toLocaleString()}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- ADD / EDIT VEHICLE MODAL ---------------- */}
        {showVehicleModal && (
          <div className="modal-overlay" onClick={() => setShowVehicleModal(false)}>
            <div
              className="modal-content"
              style={{ padding: "32px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: "22px", color: "#fff", marginBottom: "20px" }}>
                {editingVehicleId ? "Edit Vehicle" : "Add Vehicle to Inventory"}
              </h2>

              <form onSubmit={handleSaveVehicle} style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label className="input-label">VIN Number *</label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      maxLength={17}
                      value={vehicleForm.vin}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, vin: e.target.value.toUpperCase() })}
                      placeholder="17-char VIN"
                    />
                  </div>
                  <div>
                    <label className="input-label">Status</label>
                    <select
                      className="select-field"
                      value={vehicleForm.status}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value })}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="RESERVED">Reserved</option>
                      <option value="SOLD">Sold</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                  <div>
                    <label className="input-label">Make *</label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      value={vehicleForm.make}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                      placeholder="e.g. BMW"
                    />
                  </div>
                  <div>
                    <label className="input-label">Model *</label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      value={vehicleForm.model}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                      placeholder="e.g. 4 Series"
                    />
                  </div>
                  <div>
                    <label className="input-label">Year *</label>
                    <input
                      type="number"
                      className="input-field"
                      required
                      min={1980}
                      max={2030}
                      value={vehicleForm.year}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, year: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                  <div>
                    <label className="input-label">Price ($ USD) *</label>
                    <input
                      type="number"
                      className="input-field"
                      required
                      min={0}
                      value={vehicleForm.price}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="input-label">Mileage *</label>
                    <input
                      type="number"
                      className="input-field"
                      required
                      min={0}
                      value={vehicleForm.mileage}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, mileage: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="input-label">Body Type *</label>
                    <select
                      className="select-field"
                      value={vehicleForm.bodyType}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, bodyType: e.target.value })}
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Truck">Truck</option>
                      <option value="Convertible">Convertible</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                  <div>
                    <label className="input-label">Transmission</label>
                    <input
                      type="text"
                      className="input-field"
                      value={vehicleForm.transmission}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, transmission: e.target.value })}
                      placeholder="Automatic"
                    />
                  </div>
                  <div>
                    <label className="input-label">Drivetrain</label>
                    <input
                      type="text"
                      className="input-field"
                      value={vehicleForm.drivetrain}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, drivetrain: e.target.value })}
                      placeholder="AWD / FWD"
                    />
                  </div>
                  <div>
                    <label className="input-label">Fuel Type</label>
                    <input
                      type="text"
                      className="input-field"
                      value={vehicleForm.fuelType}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })}
                      placeholder="Gasoline"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Image URL</label>
                  <input
                    type="url"
                    className="input-field"
                    value={vehicleForm.imageUrl}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label className="input-label">Description / Features</label>
                  <textarea
                    rows={3}
                    className="textarea-field"
                    value={vehicleForm.description}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                    placeholder="Clean title, premium audio, heated leather seats..."
                  />
                </div>

                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                    <input
                      type="checkbox"
                      checked={vehicleForm.featured}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, featured: e.target.checked })}
                    />
                    <span>Highlight as Featured on Homepage</span>
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "14px" }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowVehicleModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={savingVehicle}>
                    {savingVehicle ? "Saving..." : editingVehicleId ? "Update Vehicle" : "Add Vehicle to Lot"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
