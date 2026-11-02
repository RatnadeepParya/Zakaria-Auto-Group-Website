import { Vehicle, VehicleFacets, ContactMessage, CreditApplication, DashboardStats } from "./types";

const getBaseUrl = (): string => {
  // Client-side requests use relative path to utilize Next.js rewrites
  if (typeof window !== "undefined") return "";
  // Server-side requests use full internal API URL
  return process.env.API_URL || "http://localhost:4000";
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
    cache: options.cache ?? "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      data?.error?.message ||
      data?.message ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

// Public API
export async function getVehicles(queryString = ""): Promise<{ data: Vehicle[]; meta: any }> {
  return apiRequest<{ data: Vehicle[]; meta: any }>(`/api/vehicles${queryString ? `?${queryString}` : ""}`);
}

export async function getVehicleFacets(): Promise<{ data: VehicleFacets }> {
  return apiRequest<{ data: VehicleFacets }>("/api/vehicles/facets");
}

export async function getVehicle(id: string): Promise<{ data: Vehicle }> {
  return apiRequest<{ data: Vehicle }>(`/api/vehicles/${id}`);
}

export async function sendContactMessage(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  vehicleId?: string;
}): Promise<{ data: { id: string; message: string } }> {
  return apiRequest<{ data: { id: string; message: string } }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitCreditApplication(payload: any): Promise<{ data: { id: string; message: string } }> {
  return apiRequest<{ data: { id: string; message: string } }>("/api/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Formatters
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatMileage(miles: number): string {
  return `${Number(miles).toLocaleString("en-US")} mi`;
}
