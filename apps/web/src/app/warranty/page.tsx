import Link from "next/link";

export default function WarrantyPage() {
  return (
    <main style={{ padding: "50px 0 90px" }}>
      <div className="container" style={{ maxWidth: "980px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="eyebrow">PROTECTION FOR THE ROAD AHEAD</span>
          <h1 className="section-title" style={{ fontSize: "38px", marginBottom: "12px" }}>
            Comprehensive Vehicle Protection
          </h1>
          <p className="section-subtitle" style={{ margin: "auto" }}>
            Drive with complete confidence. Every vehicle at Zakaria Auto Group LLC undergoes multi-point inspection, and extended warranty plans are available.
          </p>
        </div>

        {/* 3 Tier Warranty Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          <div className="glass-panel" style={{ padding: "32px" }}>
            <span style={{ fontSize: "12px", color: "var(--neon-blue)", fontWeight: 700, letterSpacing: "1px" }}>ESSENTIAL</span>
            <h3 style={{ fontSize: "20px", color: "#fff", margin: "8px 0 14px" }}>Powertrain Coverage</h3>
            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "20px" }}>
              Protects the most expensive mechanical components of your vehicle: engine, transmission, transaxle, and drive axles.
            </p>
            <ul style={{ listStyle: "none", display: "grid", gap: "8px", fontSize: "13px", color: "#e2e8f0" }}>
              <li>✓ Engine block & internal parts</li>
              <li>✓ Transmission case & assembly</li>
              <li>✓ Drive shaft & differential</li>
              <li>✓ 24/7 Roadside Assistance included</li>
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: "32px", border: "1px solid var(--neon-blue)", position: "relative" }}>
            <span style={{ position: "absolute", top: "-12px", right: "20px", background: "var(--blue)", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "4px 10px", borderRadius: "10px", letterSpacing: "1px" }}>
              MOST POPULAR
            </span>
            <span style={{ fontSize: "12px", color: "var(--neon-blue)", fontWeight: 700, letterSpacing: "1px" }}>COMPREHENSIVE</span>
            <h3 style={{ fontSize: "20px", color: "#fff", margin: "8px 0 14px" }}>Preferred Care Plus</h3>
            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "20px" }}>
              Adds electrical systems, heating/cooling, suspension, and high-tech electronic component coverage.
            </p>
            <ul style={{ listStyle: "none", display: "grid", gap: "8px", fontSize: "13px", color: "#e2e8f0" }}>
              <li>✓ Everything in Powertrain</li>
              <li>✓ Air conditioning & compressor</li>
              <li>✓ Starter, alternator & sensors</li>
              <li>✓ Steering & brake components</li>
              <li>✓ Rental car reimbursement</li>
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: "32px" }}>
            <span style={{ fontSize: "12px", color: "var(--neon-blue)", fontWeight: 700, letterSpacing: "1px" }}>MAXIMUM</span>
            <h3 style={{ fontSize: "20px", color: "#fff", margin: "8px 0 14px" }}>Exclusionary Bumper-to-Bumper</h3>
            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "20px" }}>
              The highest level of coverage. Covers virtually every mechanical and electrical breakdown except normal wear items.
            </p>
            <ul style={{ listStyle: "none", display: "grid", gap: "8px", fontSize: "13px", color: "#e2e8f0" }}>
              <li>✓ Total electronic & infotainment repair</li>
              <li>✓ Trip interruption protection</li>
              <li>✓ Zero deductible options</li>
              <li>✓ Nationwide claims accepted</li>
            </ul>
          </div>
        </div>

        {/* CTA Card */}
        <div className="glass-panel" style={{ padding: "32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "22px", color: "#fff", marginBottom: "8px" }}>
            Have Questions About Vehicle Protection?
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "22px" }}>
            Our team will explain exact terms, deductibles, and eligibility for any vehicle on our lot.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Contact Warranty Specialist →
          </Link>
        </div>
      </div>
    </main>
  );
}
