export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  priceCents: number;
  mileage: number;
  bodyType: string;
  transmission: string;
  fuelType: string;
  drivetrain: string;
  exteriorColor?: string | null;
  interiorColor?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  status: "AVAILABLE" | "RESERVED" | "SOLD" | "INACTIVE";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFacets {
  makes: { name: string; count: number }[];
  bodyTypes: { name: string; count: number }[];
  priceRange: { min: number; max: number };
  total: number;
}

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  message: string;
  vehicleId?: string | null;
  status: "NEW" | "CONTACTED" | "RESOLVED" | "SPAM";
  createdAt: string;
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number;
    priceCents: number;
  } | null;
}

export interface CreditApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssnLast4?: string | null;
  driversLicenseState?: string | null;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  employmentStatus: string;
  employerName?: string | null;
  jobTitle?: string | null;
  annualIncomeCents?: number | null;
  status: "SUBMITTED" | "REVIEWING" | "APPROVED" | "DECLINED";
  createdAt: string;
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number;
    priceCents: number;
  } | null;
}

export interface DashboardStats {
  inventory: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
  };
  messages: {
    total: number;
    new: number;
  };
  applications: {
    total: number;
    submitted: number;
  };
  latestMessages: ContactMessage[];
  latestApplications: CreditApplication[];
}
