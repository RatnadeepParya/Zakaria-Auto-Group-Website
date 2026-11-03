import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "80px",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        background: "linear-gradient(180deg, rgba(7, 21, 34, 0.7) 0%, rgba(4, 12, 20, 0.95) 100%)",
        padding: "60px 0 30px",
      }}
    >
      <div className="container">
        {/* Top Centered Brand Showcase */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
            <svg
              viewBox="0 0 240 50"
              style={{ width: "200px", height: "auto", marginBottom: "6px" }}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 40 C 60 40, 80 14, 120 14 C 160 14, 180 40, 230 40"
                stroke="#60a5fa"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M35 40 C 70 40, 85 20, 120 20 C 155 20, 170 40, 205 40"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "5px", color: "#fff" }}>
              ZAKARIA
            </span>
            <span style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--neon-blue)", fontWeight: 600, marginTop: "4px" }}>
              Auto Group
            </span>
          </div>

          {/* Nav Links */}
          <nav
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "24px",
              marginTop: "24px",
              fontSize: "14px",
              color: "var(--muted)",
            }}
          >
            <Link href="/" style={{ transition: "color 0.2s" }}>Home</Link>
            <Link href="/inventory" style={{ transition: "color 0.2s" }}>Inventory</Link>
            <Link href="/financing" style={{ transition: "color 0.2s" }}>Financing</Link>
            <Link href="/warranty" style={{ transition: "color 0.2s" }}>Warranty</Link>
            <Link href="/about" style={{ transition: "color 0.2s" }}>About Us</Link>
            <Link href="/contact" style={{ transition: "color 0.2s" }}>Contact</Link>
          </nav>

          {/* Social Icons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "18px",
              marginTop: "22px",
            }}
          >
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "grid",
                placeItems: "center",
                color: "#fff",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "grid",
                placeItems: "center",
                color: "#fff",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "grid",
                placeItems: "center",
                color: "#fff",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "32px 0" }} />

        {/* 3-Column Info Footer */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "36px",
            fontSize: "13px",
            color: "var(--muted)",
          }}
        >
          {/* Column 1: Contact */}
          <div style={{ display: "grid", gap: "12px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ color: "var(--neon-blue)" }}>⌖</span>
              <div>
                <strong style={{ color: "#fff", display: "block" }}>Location</strong>
                706 Roswell St SE<br />Marietta, GA 30060
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ color: "var(--neon-blue)" }}>☎</span>
              <div>
                <strong style={{ color: "#fff" }}>(678) 401-3044</strong>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ color: "var(--neon-blue)" }}>✉</span>
              <div>zakariaautogroup@gmail.com</div>
            </div>
          </div>

          {/* Column 2: Hours */}
          <div>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ color: "var(--neon-blue)" }}>◷</span>
              <div>
                <strong style={{ color: "#fff", display: "block", marginBottom: "4px" }}>Store Hours</strong>
                Mon – Fri: 10:00 AM – 6:00 PM<br />
                Saturday: 10:00 AM – 5:00 PM<br />
                Sunday: Closed
              </div>
            </div>
          </div>

          {/* Column 3: Quick Links & Admin */}
          <div>
            <strong style={{ color: "#fff", display: "block", marginBottom: "8px" }}>Quick Links</strong>
            <ul style={{ listStyle: "none", display: "grid", gap: "6px" }}>
              <li><Link href="/apply">Apply Online for Financing</Link></li>
              <li><Link href="/warranty">Vehicle Warranty Coverage</Link></li>
              <li><Link href="/inventory">Current Inventory</Link></li>
              <li><Link href="/contact">Schedule a Test Drive</Link></li>
              <li><Link href="/login" style={{ color: "#60a5fa" }}>Dealership Staff Login</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            marginTop: "48px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            textAlign: "center",
            fontSize: "12px",
            color: "var(--muted)",
          }}
        >
          © {new Date().getFullYear()} Zakaria Auto Group LLC. All Rights Reserved. Verified Pre-Owned Dealership in Marietta, Georgia.
        </div>
      </div>
    </footer>
  );
}
