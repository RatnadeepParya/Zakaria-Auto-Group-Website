import Link from "next/link";

export default function AboutPage() {
  return (
    <main style={{ padding: "50px 0 90px" }}>
      <div className="container" style={{ maxWidth: "980px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="eyebrow">ABOUT ZAKARIA AUTO GROUP LLC</span>
          <h1 className="section-title" style={{ fontSize: "38px", marginBottom: "12px" }}>
            A Better Car-Buying Experience
          </h1>
          <p className="section-subtitle" style={{ margin: "auto" }}>
            Serving Marietta and the greater Atlanta metro area with quality pre-owned vehicles, straightforward pricing, and personalized service.
          </p>
        </div>

        {/* Story Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "center",
            marginBottom: "56px",
          }}
          className="about-grid"
        >
          <div>
            <h2 style={{ fontSize: "24px", color: "#fff", marginBottom: "16px" }}>
              Our Story & Commitment
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "15px", marginBottom: "16px" }}>
              Founded with the goal of bringing honesty, reliability, and transparency to the pre-owned auto market, <strong>Zakaria Auto Group LLC</strong> is proudly based at <strong>706 Roswell St SE, Marietta, GA</strong>.
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "15px", marginBottom: "24px" }}>
              We believe shopping for a car shouldn't be stressful or filled with hidden fees. Every vehicle on our lot is carefully inspected for mechanical reliability, safety, and road readiness before being offered to our customers.
            </p>
            <Link href="/inventory" className="btn btn-primary">
              Browse Available Cars →
            </Link>
          </div>

          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid var(--glass-border)",
              boxShadow: "0 20px 45px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80"
              alt="Zakaria Auto Group Showroom"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>

        {/* 3 Pillars */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          <div className="glass-panel" style={{ padding: "30px" }}>
            <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>🔍</span>
            <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Rigorous Inspection</h3>
            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6 }}>
              All vehicles pass comprehensive multi-point mechanical inspections and computer diagnostics.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "30px" }}>
            <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>💵</span>
            <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Transparent Pricing</h3>
            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6 }}>
              What you see is what you pay. No bait-and-switch pricing or inflated dealer doc fees.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "30px" }}>
            <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>🛡️</span>
            <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Trusted Financing</h3>
            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6 }}>
              Relationships with reputable lenders ensuring competitive rates and flexible loan terms.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
