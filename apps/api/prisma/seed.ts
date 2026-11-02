import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole, VehicleStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("Seeding database for Zakaria Auto Group LLC...");

  // 1. Seed Admin
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@zakariaautogroup.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "AdminZakaria2026!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
      emailVerified: true,
      isActive: true,
    },
    create: {
      email,
      passwordHash,
      firstName: "Zakaria",
      lastName: "Manager",
      phone: "(678) 401-3044",
      role: UserRole.ADMIN,
      emailVerified: true,
      isActive: true,
    },
  });
  console.log(`Admin account initialized: ${email}`);

  // 2. Seed Initial 9 Demo Vehicles (Matching client reference mockup)
  const existingVehicles = await prisma.vehicle.count();
  if (existingVehicles === 0) {
    const demoVehicles = [
      {
        vin: "WBA8E9G50GNU12345",
        make: "BMW",
        model: "4 Series",
        year: 2017,
        priceCents: 1149500, // $11,495
        mileage: 95910,
        bodyType: "Coupe",
        transmission: "Automatic",
        fuelType: "Gasoline",
        drivetrain: "AWD",
        exteriorColor: "Dark Blue Metallic",
        interiorColor: "Black Dakota Leather",
        imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
        featured: true,
        status: VehicleStatus.AVAILABLE,
        description: "Striking 2017 BMW 4 Series Coupe in stunning metallic dark blue with AWD xDrive. Premium sound, heated sport seats, sunroof, and precision German handling. Fully inspected.",
      },
      {
        vin: "KMHD84LF2HU123456",
        make: "Hyundai",
        model: "Elantra",
        year: 2020,
        priceCents: 899500, // $8,995
        mileage: 71214,
        bodyType: "Sedan",
        transmission: "Automatic",
        fuelType: "Gasoline",
        drivetrain: "FWD",
        exteriorColor: "Ceramic White",
        interiorColor: "Gray Fabric",
        imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
        featured: true,
        status: VehicleStatus.AVAILABLE,
        description: "Extremely reliable and efficient 2020 Hyundai Elantra. Exceptional fuel economy (up to 40 MPG highway), Apple CarPlay/Android Auto, forward collision warning, and backup camera.",
      },
      {
        vin: "1G1ZD5ST9JF123456",
        make: "Chevrolet",
        model: "Malibu",
        year: 2018,
        priceCents: 1049500, // $10,495
        mileage: 68400,
        bodyType: "Sedan",
        transmission: "Automatic",
        fuelType: "Gasoline",
        drivetrain: "FWD",
        exteriorColor: "Silver Metallic",
        interiorColor: "Jet Black",
        imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80",
        featured: false,
        status: VehicleStatus.AVAILABLE,
        description: "Smooth-riding 2018 Chevrolet Malibu LT with low mileage. Spacious cabin, modern touchscreen infotainment, Wi-Fi hotspot capability, and great fuel efficiency.",
      },
      {
        vin: "1FM5K8D84LGA12345",
        make: "Ford",
        model: "Explorer",
        year: 2020,
        priceCents: 2199500, // $21,995
        mileage: 64100,
        bodyType: "SUV",
        transmission: "Automatic",
        fuelType: "Gasoline",
        drivetrain: "AWD",
        exteriorColor: "Atlas Blue",
        interiorColor: "Ebony",
        imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
        featured: true,
        status: VehicleStatus.AVAILABLE,
        description: "Family-ready 2020 Ford Explorer XLT AWD with 3rd-row seating. Equipped with Ford Co-Pilot360, power liftgate, twin-panel moonroof, and terrain management system.",
      },
      {
        vin: "1N4BL4BV7KC123456",
        make: "Nissan",
        model: "Altima",
        year: 2019,
        priceCents: 1299500, // $12,995
        mileage: 58200,
        bodyType: "Sedan",
        transmission: "Automatic",
        fuelType: "Gasoline",
        drivetrain: "FWD",
        exteriorColor: "Gun Metallic Gray",
        interiorColor: "Charcoal",
        imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
        featured: false,
        status: VehicleStatus.AVAILABLE,
        description: "Sharp 2019 Nissan Altima SV with intelligent emergency braking, blind-spot warning, remote start, and zero-gravity seating for supreme long-distance comfort.",
      },
      {
        vin: "KM8J3CA46JU123456",
        make: "Hyundai",
        model: "Tucson",
        year: 2018,
        priceCents: 1399500, // $13,995
        mileage: 75600,
        bodyType: "SUV",
        transmission: "Automatic",
        fuelType: "Gasoline",
        drivetrain: "AWD",
        exteriorColor: "Coliseum Gray",
        interiorColor: "Black Leatherette",
        imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
        featured: false,
        status: VehicleStatus.AVAILABLE,
        description: "Versatile 2018 Hyundai Tucson SEL AWD. Compact footprint with roomy cargo area, heated front seats, blind spot detection, and roof rails for road trips.",
      },
      {
        vin: "1C4RJFBG7FC123456",
        make: "Jeep",
        model: "Grand Cherokee",
        year: 2015,
        priceCents: 1599500, // $15,995
        mileage: 83400,
        bodyType: "SUV",
        transmission: "Automatic",
        fuelType: "Gasoline",
        drivetrain: "4WD",
        exteriorColor: "Brilliant Black Crystal",
        interiorColor: "Black Leather",
        imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
        featured: false,
        status: VehicleStatus.AVAILABLE,
        description: "Commanding 2015 Jeep Grand Cherokee Limited 4x4. Luxurious leather interior, navigation, heated steering wheel and front/rear seats, Quadra-Trac II 4WD system.",
      },
      {
        vin: "1FA6P8TH5J5123456",
        make: "Ford",
        model: "Mustang",
        year: 2018,
        priceCents: 2399500, // $23,995
        mileage: 45900,
        bodyType: "Coupe",
        transmission: "Manual",
        fuelType: "Gasoline",
        drivetrain: "RWD",
        exteriorColor: "Race Red",
        interiorColor: "Ebony Cloth",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        featured: true,
        status: VehicleStatus.AVAILABLE,
        description: "Pure performance 2018 Ford Mustang GT with 6-speed manual transmission. 5.0L V8 Coyote power, active valve performance exhaust, Track Apps, and launch control.",
      },
      {
        vin: "1FTFW1ED6HFA12345",
        make: "Ford",
        model: "F-150",
        year: 2017,
        priceCents: 2499500, // $24,995
        mileage: 82100,
        bodyType: "Truck",
        transmission: "Automatic",
        fuelType: "Gasoline",
        drivetrain: "4WD",
        exteriorColor: "Magnetic Metallic",
        interiorColor: "Medium Earth Gray",
        imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
        featured: false,
        status: VehicleStatus.AVAILABLE,
        description: "Dependable 2017 Ford F-150 SuperCrew XLT 4x4. 3.5L EcoBoost engine with heavy-duty tow package, spray-in bedliner, backup camera, and seating for six.",
      },
    ];

    await prisma.vehicle.createMany({ data: demoVehicles });
    console.log(`Seeded ${demoVehicles.length} vehicles matching client specifications.`);
  }

  console.log("Database seed completed successfully.");
}

main()
  .catch((err) => {
    console.error("Error during database seed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
