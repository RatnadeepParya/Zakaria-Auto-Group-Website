"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Vehicle } from "../../lib/types";
import { getVehicle, submitCreditApplication, formatCurrency, formatMileage } from "../../lib/api";

function ApplyFormContent() {
  const searchParams = useSearchParams();
  const initialVehicleId = searchParams.get("vehicleId") || "";

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Selected Vehicle State
  const [vehicleId, setVehicleId] = useState<string>(initialVehicleId);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [vehicleLoading, setVehicleLoading] = useState(false);

  // Field validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Maximum date of birth: 18 years ago today
  const today = new Date();
  const maxDobDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const maxDobString = maxDobDate.toISOString().split("T")[0]; // YYYY-MM-DD
  const minDobString = "1920-01-01";
  const todayString = today.toISOString().split("T")[0];

  // Form State matching Mockup Panel 3
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    ssn: "",
    driversLicenseNumber: "",
    driversLicenseState: "GA",
    issueDate: "",
    expiryDate: "",

    // Step 2: Address
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "GA",
    postalCode: "",
    housingStatus: "Own",
    monthlyPayment: "1200",

    // Step 3: Employment
    employmentStatus: "Employed",
    employerName: "",
    jobTitle: "",
    annualIncome: "65000",
    yearsEmployed: "3",

    // Step 4: Disclaimers
    consentCreditCheck: true,
  });

  // Fetch vehicle if vehicleId is present in query parameters
  useEffect(() => {
    if (vehicleId) {
      setVehicleLoading(true);
      getVehicle(vehicleId)
        .then((res) => {
          setVehicle(res.data);
        })
        .catch(() => {
          setVehicle(null);
        })
        .finally(() => setVehicleLoading(false));
    } else {
      setVehicle(null);
    }
  }, [vehicleId]);

  // Phone Formatter: (XXX) XXX-XXXX
  function formatPhone(val: string): string {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  // SSN Formatter: XXX-XX-XXXX
  function formatSSN(val: string): string {
    const digits = val.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
  }

  // Postal Code Formatter: 5 digits
  function formatZip(val: string): string {
    return val.replace(/\D/g, "").slice(0, 5);
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error as user edits
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Validation functions
  function validateDOB(dob: string): string | null {
    if (!dob) return "Date of birth is required.";
    // Match YYYY-MM-DD
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
    if (!match) return "Please enter a valid date of birth (YYYY-MM-DD).";
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return "Invalid calendar date.";
    }

    const birthDate = new Date(year, month - 1, day);
    if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
      return "Invalid calendar date.";
    }

    let age = today.getFullYear() - year;
    const m = today.getMonth() - (month - 1);
    if (m < 0 || (m === 0 && today.getDate() < day)) {
      age--;
    }

    if (age < 18) {
      return "Applicant must be at least 18 years old to apply for financing.";
    }
    if (age > 120) {
      return "Please enter a valid date of birth.";
    }
    return null;
  }

  function validateStep1(): boolean {
    const errs: Record<string, string> = {};

    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      errs.firstName = "First name must be at least 2 characters.";
    }
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      errs.lastName = "Last name must be at least 2 characters.";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      errs.phone = "Phone number must be at least 10 digits.";
    }

    const dobErr = validateDOB(formData.dateOfBirth);
    if (dobErr) {
      errs.dateOfBirth = dobErr;
    }

    const ssnDigits = formData.ssn.replace(/\D/g, "");
    if (formData.ssn && ssnDigits.length !== 9) {
      errs.ssn = "SSN must be 9 digits (XXX-XX-XXXX).";
    }

    if (formData.driversLicenseNumber && formData.driversLicenseNumber.trim().length < 4) {
      errs.driversLicenseNumber = "Driver's license must be at least 4 characters.";
    }

    if (formData.expiryDate) {
      if (formData.expiryDate <= todayString) {
        errs.expiryDate = "Driver's license must not be expired.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2(): boolean {
    const errs: Record<string, string> = {};

    if (!formData.addressLine1.trim() || formData.addressLine1.trim().length < 5) {
      errs.addressLine1 = "Street address must be at least 5 characters.";
    }
    if (!formData.city.trim() || formData.city.trim().length < 2) {
      errs.city = "City is required.";
    }
    if (!formData.state.trim()) {
      errs.state = "State is required.";
    }
    if (!formData.postalCode.trim() || formData.postalCode.trim().length !== 5) {
      errs.postalCode = "Please enter a valid 5-digit US ZIP code.";
    }
    if (formData.monthlyPayment && Number(formData.monthlyPayment) < 0) {
      errs.monthlyPayment = "Monthly payment cannot be negative.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep3(): boolean {
    const errs: Record<string, string> = {};

    if (!formData.employmentStatus) {
      errs.employmentStatus = "Employment status is required.";
    }
    if (!formData.annualIncome || Number(formData.annualIncome) <= 0) {
      errs.annualIncome = "Please enter a valid annual income greater than $0.";
    }
    if (formData.employmentStatus === "Employed" && !formData.employerName.trim()) {
      errs.employerName = "Employer name is required when employed.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNextStep(targetStep: number) {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep(targetStep);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      setServerError("Please correct the highlighted errors before submitting.");
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      await submitCreditApplication({
        ...formData,
        vehicleId: vehicleId || undefined,
        monthlyPayment: Number(formData.monthlyPayment) || 0,
        annualIncome: Number(formData.annualIncome) || 0,
        yearsEmployed: Number(formData.yearsEmployed) || 0,
      });
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ padding: "50px 0 90px" }}>
      <div className="container" style={{ maxWidth: "860px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span className="eyebrow">ZAKARIA AUTO GROUP LLC</span>
          <h1 className="section-title" style={{ fontSize: "36px", marginBottom: "8px" }}>
            Online Credit Application
          </h1>
          <p className="section-subtitle" style={{ margin: "auto" }}>
            Get pre-approved in minutes with our bank-grade encrypted application.
          </p>
        </div>

        {/* Selected Vehicle Banner (if applied from a vehicle detail page) */}
        {vehicle && (
          <div
            className="glass-panel"
            style={{
              padding: "16px 20px",
              marginBottom: "28px",
              background: "linear-gradient(90deg, rgba(37, 99, 235, 0.18) 0%, rgba(14, 29, 44, 0.7) 100%)",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {vehicle.imageUrl && (
                <img
                  src={vehicle.imageUrl}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  style={{
                    width: "70px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid var(--glass-border)",
                  }}
                />
              )}
              <div>
                <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--neon-blue)", fontWeight: 700, letterSpacing: "1px" }}>
                  FINANCING SELECTED VEHICLE
                </span>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", margin: "2px 0" }}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>
                <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                  Price: <strong style={{ color: "#fff" }}>{formatCurrency(vehicle.priceCents)}</strong> • Mileage: {formatMileage(vehicle.mileage)} • VIN: <code style={{ color: "var(--neon-blue)" }}>{vehicle.vin}</code>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setVehicleId("");
                setVehicle(null);
              }}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid var(--glass-border)",
                color: "var(--muted)",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Clear Vehicle ✕
            </button>
          </div>
        )}

        {/* 4-Step Progress Indicator */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
            marginBottom: "36px",
            position: "relative",
          }}
        >
          {[
            { num: 1, label: "Personal Info" },
            { num: 2, label: "Address" },
            { num: 3, label: "Employment" },
            { num: 4, label: "Review" },
          ].map((item) => {
            const isCompleted = step > item.num;
            const isCurrent = step === item.num;
            return (
              <div
                key={item.num}
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 700,
                    fontSize: "14px",
                    background: isCurrent
                      ? "var(--blue)"
                      : isCompleted
                      ? "#22c55e"
                      : "rgba(255,255,255,0.08)",
                    color: isCurrent || isCompleted ? "#fff" : "var(--muted)",
                    border: isCurrent ? "2px solid var(--neon-blue)" : "1px solid var(--glass-border)",
                    transition: "all 0.2s",
                  }}
                >
                  {isCompleted ? "✓" : item.num}
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: isCurrent ? "#fff" : "var(--muted)",
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="glass-panel" style={{ padding: "36px" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.2)",
                  border: "2px solid #22c55e",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 20px",
                  fontSize: "30px",
                  color: "#22c55e",
                }}
              >
                ✓
              </div>
              <h2 style={{ fontSize: "24px", color: "#fff", marginBottom: "12px" }}>
                Application Submitted Successfully!
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "15px", maxWidth: "540px", margin: "auto", lineHeight: 1.6 }}>
                Thank you, <strong>{formData.firstName}</strong>. Your credit application has been securely transmitted to our financing team at Zakaria Auto Group LLC. An advisor will contact you at <strong>{formData.phone}</strong> within 1 business day.
              </p>
              <div style={{ marginTop: "30px" }}>
                <Link href="/inventory" className="btn btn-primary">
                  Browse More Vehicles
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* ---------------- STEP 1: PERSONAL INFORMATION ---------------- */}
              {step === 1 && (
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "22px" }}>
                    Personal Information
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }} className="form-cols">
                    <div>
                      <label className="input-label">First Name *</label>
                      <input
                        type="text"
                        className={`input-field ${errors.firstName ? "input-error" : ""}`}
                        required
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        placeholder="John"
                        style={errors.firstName ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.firstName && (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.firstName}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="input-label">Last Name *</label>
                      <input
                        type="text"
                        className={`input-field ${errors.lastName ? "input-error" : ""}`}
                        required
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        placeholder="Doe"
                        style={errors.lastName ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.lastName && (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.lastName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginTop: "16px" }} className="form-cols">
                    <div>
                      <label className="input-label">Email *</label>
                      <input
                        type="email"
                        className={`input-field ${errors.email ? "input-error" : ""}`}
                        required
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="john.doe@example.com"
                        style={errors.email ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.email && (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.email}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="input-label">Cell Phone * (10 Digits)</label>
                      <input
                        type="tel"
                        className={`input-field ${errors.phone ? "input-error" : ""}`}
                        required
                        value={formData.phone}
                        onChange={(e) => updateField("phone", formatPhone(e.target.value))}
                        placeholder="(678) 555-0100"
                        style={errors.phone ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.phone && (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginTop: "16px" }} className="form-cols">
                    <div>
                      <label className="input-label">Date of Birth * (Must be 18+)</label>
                      <input
                        type="date"
                        className={`input-field ${errors.dateOfBirth ? "input-error" : ""}`}
                        required
                        max={maxDobString}
                        min={minDobString}
                        value={formData.dateOfBirth}
                        onChange={(e) => updateField("dateOfBirth", e.target.value)}
                        style={errors.dateOfBirth ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.dateOfBirth ? (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.dateOfBirth}
                        </div>
                      ) : (
                        <div style={{ color: "var(--muted)", fontSize: "11px", marginTop: "4px" }}>
                          Applicant must be at least 18 years of age.
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="input-label">SSN * (AES-256 Encrypted)</label>
                      <input
                        type="text"
                        className={`input-field ${errors.ssn ? "input-error" : ""}`}
                        value={formData.ssn}
                        onChange={(e) => updateField("ssn", formatSSN(e.target.value))}
                        placeholder="XXX-XX-XXXX"
                        maxLength={11}
                        style={errors.ssn ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.ssn && (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.ssn}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginTop: "16px" }} className="form-cols">
                    <div>
                      <label className="input-label">Driver's License Number</label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.driversLicenseNumber}
                        onChange={(e) => updateField("driversLicenseNumber", e.target.value.toUpperCase())}
                        placeholder="D1234567"
                        maxLength={20}
                        style={errors.driversLicenseNumber ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.driversLicenseNumber && (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.driversLicenseNumber}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="input-label">Driver's License State</label>
                      <select
                        className="select-field"
                        value={formData.driversLicenseState}
                        onChange={(e) => updateField("driversLicenseState", e.target.value)}
                      >
                        <option value="GA">Georgia (GA)</option>
                        <option value="FL">Florida (FL)</option>
                        <option value="AL">Alabama (AL)</option>
                        <option value="TN">Tennessee (TN)</option>
                        <option value="NC">North Carolina (NC)</option>
                        <option value="SC">South Carolina (SC)</option>
                        <option value="TX">Texas (TX)</option>
                        <option value="CA">California (CA)</option>
                        <option value="NY">New York (NY)</option>
                        <option value="OTHER">Other State</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginTop: "16px" }} className="form-cols">
                    <div>
                      <label className="input-label">License Issue Date</label>
                      <input
                        type="date"
                        className="input-field"
                        max={todayString}
                        value={formData.issueDate}
                        onChange={(e) => updateField("issueDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="input-label">License Expiry Date (Must be in future)</label>
                      <input
                        type="date"
                        className="input-field"
                        min={todayString}
                        value={formData.expiryDate}
                        onChange={(e) => updateField("expiryDate", e.target.value)}
                        style={errors.expiryDate ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.expiryDate && (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.expiryDate}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: "right", marginTop: "28px" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleNextStep(2)}
                    >
                      Next: Address Info →
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------- STEP 2: ADDRESS INFORMATION ---------------- */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "22px" }}>
                    Residential Address
                  </h3>

                  <div style={{ marginBottom: "16px" }}>
                    <label className="input-label">Street Address *</label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      value={formData.addressLine1}
                      onChange={(e) => updateField("addressLine1", e.target.value)}
                      placeholder="123 Peach Street"
                      style={errors.addressLine1 ? { borderColor: "#ef4444" } : {}}
                    />
                    {errors.addressLine1 && (
                      <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                        {errors.addressLine1}
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label className="input-label">Apt / Suite / Unit (Optional)</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.addressLine2}
                      onChange={(e) => updateField("addressLine2", e.target.value)}
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px" }} className="form-cols">
                    <div>
                      <label className="input-label">City *</label>
                      <input
                        type="text"
                        className="input-field"
                        required
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        placeholder="Marietta"
                        style={errors.city ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.city && (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.city}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="input-label">State *</label>
                      <input
                        type="text"
                        className="input-field"
                        required
                        value={formData.state}
                        onChange={(e) => updateField("state", e.target.value.toUpperCase())}
                        placeholder="GA"
                        maxLength={2}
                        style={errors.state ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.state && (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.state}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="input-label">Postal Code *</label>
                      <input
                        type="text"
                        className="input-field"
                        required
                        value={formData.postalCode}
                        onChange={(e) => updateField("postalCode", formatZip(e.target.value))}
                        placeholder="30060"
                        maxLength={5}
                        style={errors.postalCode ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.postalCode && (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.postalCode}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginTop: "16px" }} className="form-cols">
                    <div>
                      <label className="input-label">Housing Status</label>
                      <select
                        className="select-field"
                        value={formData.housingStatus}
                        onChange={(e) => updateField("housingStatus", e.target.value)}
                      >
                        <option value="Own">Own Home</option>
                        <option value="Rent">Rent</option>
                        <option value="Other">Other / Living with Family</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Monthly Rent or Mortgage ($)</label>
                      <input
                        type="number"
                        className="input-field"
                        min="0"
                        value={formData.monthlyPayment}
                        onChange={(e) => updateField("monthlyPayment", e.target.value)}
                        placeholder="1200"
                        style={errors.monthlyPayment ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.monthlyPayment && (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.monthlyPayment}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                      ← Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleNextStep(3)}
                    >
                      Next: Employment Info →
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------- STEP 3: EMPLOYMENT & INCOME ---------------- */}
              {step === 3 && (
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "22px" }}>
                    Employment & Income
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }} className="form-cols">
                    <div>
                      <label className="input-label">Employment Status *</label>
                      <select
                        className="select-field"
                        value={formData.employmentStatus}
                        onChange={(e) => updateField("employmentStatus", e.target.value)}
                      >
                        <option value="Employed">Employed (Full/Part-Time)</option>
                        <option value="Self-Employed">Self-Employed</option>
                        <option value="Retired">Retired</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Estimated Annual Gross Income ($) *</label>
                      <input
                        type="number"
                        className="input-field"
                        required
                        min="0"
                        value={formData.annualIncome}
                        onChange={(e) => updateField("annualIncome", e.target.value)}
                        placeholder="65000"
                        style={errors.annualIncome ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.annualIncome && (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.annualIncome}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginTop: "16px" }} className="form-cols">
                    <div>
                      <label className="input-label">
                        Employer Name {formData.employmentStatus === "Employed" ? "*" : ""}
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.employerName}
                        onChange={(e) => updateField("employerName", e.target.value)}
                        placeholder="Company name"
                        style={errors.employerName ? { borderColor: "#ef4444" } : {}}
                      />
                      {errors.employerName && (
                        <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                          {errors.employerName}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="input-label">Job Title / Occupation</label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.jobTitle}
                        onChange={(e) => updateField("jobTitle", e.target.value)}
                        placeholder="e.g. Sales Specialist, Manager"
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <label className="input-label">Years at Current Position</label>
                    <input
                      type="number"
                      className="input-field"
                      min="0"
                      value={formData.yearsEmployed}
                      onChange={(e) => updateField("yearsEmployed", e.target.value)}
                      placeholder="3"
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
                      ← Back
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => handleNextStep(4)}>
                      Next: Review & Submit →
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------- STEP 4: REVIEW & SUBMIT ---------------- */}
              {step === 4 && (
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>
                    Review Your Application
                  </h3>

                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "10px",
                      padding: "20px",
                      fontSize: "14px",
                      display: "grid",
                      gap: "10px",
                      marginBottom: "24px",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    {vehicle && (
                      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "10px" }}>
                        <strong>Financing Vehicle:</strong> {vehicle.year} {vehicle.make} {vehicle.model} ({formatCurrency(vehicle.priceCents)}) • VIN: {vehicle.vin}
                      </div>
                    )}
                    <div><strong>Applicant:</strong> {formData.firstName} {formData.lastName}</div>
                    <div><strong>Email & Phone:</strong> {formData.email} • {formData.phone}</div>
                    <div><strong>Date of Birth:</strong> {formData.dateOfBirth} (Verified 18+)</div>
                    {formData.ssn && <div><strong>SSN:</strong> ***-**-{formData.ssn.replace(/\D/g, "").slice(-4)} (Securely Encrypted)</div>}
                    <div><strong>Residence:</strong> {formData.addressLine1} {formData.addressLine2 ? `, ${formData.addressLine2}` : ""}, {formData.city}, {formData.state} {formData.postalCode}</div>
                    <div><strong>Housing:</strong> {formData.housingStatus} (${Number(formData.monthlyPayment || 0).toLocaleString()}/month)</div>
                    <div><strong>Employment:</strong> {formData.employmentStatus} ({formData.employerName || "N/A"}) • ${Number(formData.annualIncome || 0).toLocaleString()}/year</div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "flex", gap: "12px", alignItems: "flex-start", cursor: "pointer", fontSize: "13px", color: "var(--muted)" }}>
                      <input
                        type="checkbox"
                        checked={formData.consentCreditCheck}
                        onChange={(e) => updateField("consentCreditCheck", e.target.checked)}
                        style={{ marginTop: "3px" }}
                      />
                      <span>
                        I certify that the information provided is accurate and authorize Zakaria Auto Group LLC and its lending partners to verify my credit profile in accordance with the Fair Credit Reporting Act (FCRA).
                      </span>
                    </label>
                  </div>

                  {serverError && (
                    <div style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px", padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                      {serverError}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(3)}>
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting || !formData.consentCreditCheck}
                    >
                      {submitting ? "Submitting Application..." : "Submit Secure Application ✓"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px 0", textAlign: "center", color: "var(--muted)" }}>Loading application...</div>}>
      <ApplyFormContent />
    </Suspense>
  );
}
