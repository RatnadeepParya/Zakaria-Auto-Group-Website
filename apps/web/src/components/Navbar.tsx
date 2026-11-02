"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/inventory", label: "Inventory" },
    { href: "/financing", label: "Financing" },
    { href: "/warranty", label: "Warranty" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(7, 21, 34, 0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "12px 0",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo with Car Silhouette Arch */}
        <Link href="/" className="brand-container">
          <svg
            className="brand-car-svg"
            viewBox="0 0 200 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Aerodynamic car silhouette roofline curve */}
            <path
              d="M10 32 C 45 32, 60 12, 100 12 C 140 12, 155 32, 190 32"
              stroke="#60a5fa"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M30 32 C 55 32, 70 18, 100 18 C 130 18, 145 32, 170 32"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="brand-text">ZAKARIA</span>
          <span className="brand-subtext">A U T O &nbsp; G R O U P &nbsp; L L C</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: "none",
            alignItems: "center",
            gap: "24px",
            fontSize: "14px",
            fontWeight: 500,
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: isActive ? "#ffffff" : "var(--muted)",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
                  transition: "all 0.2s ease",
                  border: isActive ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Link href="/inventory" aria-label="Search Inventory" style={{ color: "var(--muted)", padding: "6px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          <Link href="/apply" className="btn btn-light" style={{ padding: "8px 18px", fontSize: "13px" }}>
            Apply Now
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-toggle"
            aria-label="Toggle menu"
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            padding: "16px 20px",
            background: "rgba(7, 21, 34, 0.98)",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                color: pathname === link.href ? "var(--neon-blue)" : "var(--text)",
                padding: "8px 0",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            style={{
              color: "var(--muted)",
              fontSize: "13px",
              marginTop: "8px",
            }}
          >
            Dealer Admin Portal →
          </Link>
        </div>
      )}
    </header>
  );
}
