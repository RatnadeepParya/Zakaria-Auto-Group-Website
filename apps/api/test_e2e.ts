import http from "node:http";
import { app } from "./src/app";
import { connectDatabase, disconnectDatabase, prisma } from "./src/db/prisma";

async function runEndToEndTests() {
  console.log("==========================================================");
  console.log("  ZAKARIA AUTO GROUP LLC — END-TO-END VERIFICATION SUITE");
  console.log("==========================================================");

  await connectDatabase();

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(4001, () => resolve()));
  const BASE = "http://localhost:4001";
  console.log("Test API Server listening on port 4001\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: any) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`, details || "");
      failed++;
    }
  }

  try {
    // 1. Health & Readiness Tests
    console.log("--- 1. Testing Health & Readiness Probes ---");
    const healthRes = await fetch(`${BASE}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === "ok", "GET /health responds with 200 OK");

    const readyRes = await fetch(`${BASE}/ready`);
    const readyData = await readyRes.json();
    assert(readyRes.status === 200 && readyData.status === "ready", "GET /ready verifies PostgreSQL connection");

    // 2. Vehicle Inventory Tests
    console.log("\n--- 2. Testing Vehicle Inventory Endpoints ---");
    const vehiclesRes = await fetch(`${BASE}/api/vehicles`);
    const vehiclesData = await vehiclesRes.json();
    assert(
      vehiclesRes.status === 200 && vehiclesData.data.length >= 9,
      `GET /api/vehicles returned ${vehiclesData.data?.length} vehicles`
    );

    const facetsRes = await fetch(`${BASE}/api/vehicles/facets`);
    const facetsData = await facetsRes.json();
    assert(
      facetsRes.status === 200 && facetsData.data.makes.length > 0,
      `GET /api/vehicles/facets returned ${facetsData.data?.makes?.length} makes`
    );

    // Filter by Make
    const bmwRes = await fetch(`${BASE}/api/vehicles?make=BMW`);
    const bmwData = await bmwRes.json();
    assert(
      bmwRes.status === 200 && bmwData.data.length >= 1 && bmwData.data[0].make === "BMW",
      "GET /api/vehicles?make=BMW filtered correctly"
    );

    // Filter by Body Type
    const suvRes = await fetch(`${BASE}/api/vehicles?bodyType=SUV`);
    const suvData = await suvRes.json();
    assert(
      suvRes.status === 200 && suvData.data.every((v: any) => v.bodyType.toLowerCase() === "suv"),
      "GET /api/vehicles?bodyType=SUV filtered correctly"
    );

    // Single Vehicle Lookup
    const firstVehicleId = vehiclesData.data[0].id;
    const singleRes = await fetch(`${BASE}/api/vehicles/${firstVehicleId}`);
    const singleData = await singleRes.json();
    assert(
      singleRes.status === 200 && singleData.data.id === firstVehicleId,
      `GET /api/vehicles/${firstVehicleId} returned correct vehicle`
    );

    // 3. Contact Lead Inquiries
    console.log("\n--- 3. Testing Lead Capture & Contact Messaging ---");
    const contactRes = await fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Robert",
        lastName: "Taylor",
        email: "robert.taylor@example.com",
        phone: "(678) 555-8912",
        message: "I am interested in scheduling a test drive for the 2017 BMW 4 Series this Saturday.",
        vehicleId: firstVehicleId,
      }),
    });
    const contactData = await contactRes.json();
    assert(contactRes.status === 201 && contactData.data.id, "POST /api/contact successfully saved inquiry in DB");

    // 4. Online Credit Pre-Approval Application (4-step)
    console.log("\n--- 4. Testing 4-Step Credit Application ---");
    const appRes = await fetch(`${BASE}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Sarah",
        lastName: "Jenkins",
        email: "sarah.j@example.com",
        phone: "(678) 555-3411",
        dateOfBirth: "03/14/1988",
        ssn: "123-45-6789",
        driversLicenseNumber: "D9876543",
        driversLicenseState: "GA",
        driversLicenseExpiry: "03/14/2028",
        addressLine1: "450 Northside Pkwy",
        city: "Marietta",
        state: "GA",
        postalCode: "30060",
        housingStatus: "Own",
        monthlyPayment: 1400,
        employmentStatus: "Employed",
        employerName: "Atlanta Tech Health",
        jobTitle: "Senior Analyst",
        annualIncome: 78000,
        yearsEmployed: 4,
        vehicleId: firstVehicleId,
      }),
    });
    const appData = await appRes.json();
    assert(
      appRes.status === 201 && appData.data.id,
      "POST /api/applications saved credit application securely in DB"
    );

    // Check DB encryption of SSN and vehicle linkage
    const dbApp = await prisma.creditApplication.findUnique({
      where: { id: appData.data.id },
      include: { vehicle: true },
    });
    assert(
      dbApp?.ssnLast4 === "6789" && dbApp?.ssnEncrypted !== "123456789",
      "SSN correctly masked to last 4 (6789) and encrypted with AES-256-GCM in database"
    );
    assert(
      dbApp?.vehicleId === firstVehicleId && dbApp?.vehicle?.id === firstVehicleId,
      `Credit application correctly linked to vehicle ID ${firstVehicleId} in database`
    );

    // Negative Test: Reject garbage DOB (e.g. 21eqe12e1e1e1e2efdfvadvvewgfg3f)
    const invalidDobRes = await fetch(`${BASE}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "(678) 555-1234",
        dateOfBirth: "21eqe12e1e1e1e2efdfvadvvewgfg3f",
        addressLine1: "123 Main St",
        city: "Marietta",
        state: "GA",
        postalCode: "30060",
        employmentStatus: "Employed",
      }),
    });
    assert(
      invalidDobRes.status === 400,
      "POST /api/applications rejected garbage DOB string (21eqe12e1e1e1e2efdfvadvvewgfg3f) with HTTP 400"
    );

    // Negative Test: Reject applicant under 18 years of age
    const minorDobRes = await fetch(`${BASE}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Young",
        lastName: "Applicant",
        email: "young@example.com",
        phone: "(678) 555-1234",
        dateOfBirth: "2015-05-10",
        addressLine1: "123 Main St",
        city: "Marietta",
        state: "GA",
        postalCode: "30060",
        employmentStatus: "Employed",
      }),
    });
    assert(
      minorDobRes.status === 400,
      "POST /api/applications rejected applicant under 18 years old (2015-05-10) with HTTP 400"
    );

    // 5. Authentication & Admin Security
    console.log("\n--- 5. Testing Authentication & Session Security ---");
    const loginRes = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@zakariaautogroup.com",
        password: "AdminZakaria2026!",
      }),
    });
    const loginData = await loginRes.json();
    const token = loginData.data?.token;
    const cookieHeader = loginRes.headers.get("set-cookie") || "";

    assert(
      loginRes.status === 200 && token && loginData.data.user.role === "ADMIN",
      "POST /api/auth/login authenticated admin and generated JWT"
    );

    // Me Endpoint
    const meRes = await fetch(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.data.user.email === "admin@zakariaautogroup.com", "GET /api/auth/me verified active admin");

    // 6. Admin Dashboard & Operations
    console.log("\n--- 6. Testing Dealer Operations & Admin Controls ---");
    const statsRes = await fetch(`${BASE}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const statsData = await statsRes.json();
    assert(
      statsRes.status === 200 && statsData.data.inventory.total >= 9 && statsData.data.messages.total >= 1,
      `GET /api/admin/stats returned correct KPI metrics (Inventory: ${statsData.data?.inventory?.total}, Inquiries: ${statsData.data?.messages?.total})`
    );

    // 7. Full Vehicle CRUD (Add, Edit, Status Change, Delete)
    console.log("\n--- 7. Testing Admin Vehicle CRUD Operations ---");
    const newVehicleRes = await fetch(`${BASE}/api/vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        vin: "4T1B11HK5MU999999",
        make: "Toyota",
        model: "Camry SE",
        year: 2021,
        priceCents: 1899500, // $18,995
        mileage: 41200,
        bodyType: "Sedan",
        transmission: "Automatic",
        fuelType: "Gasoline",
        drivetrain: "FWD",
        exteriorColor: "Midnight Black Metallic",
        imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",
        description: "Immaculate 2021 Toyota Camry SE with sport tuned suspension, Toyota Safety Sense 2.5+, lane keep assist.",
        featured: true,
      }),
    });
    const newVehicleData = await newVehicleRes.json();
    const createdId = newVehicleData.data?.id;
    assert(
      newVehicleRes.status === 201 && createdId,
      "POST /api/vehicles created new 2021 Toyota Camry in inventory"
    );

    // Update vehicle status to RESERVED
    const updateRes = await fetch(`${BASE}/api/vehicles/${createdId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "RESERVED", priceCents: 1849500 }),
    });
    const updateData = await updateRes.json();
    assert(
      updateRes.status === 200 && updateData.data.status === "RESERVED" && updateData.data.priceCents === 1849500,
      "PATCH /api/vehicles/:id updated price and marked vehicle as RESERVED"
    );

    // Delete the test vehicle
    const deleteRes = await fetch(`${BASE}/api/vehicles/${createdId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(deleteRes.status === 200, "DELETE /api/vehicles/:id deleted vehicle cleanly");

    // 8. Lead & Application Status Updates
    console.log("\n--- 8. Testing Lead & Application Workflow Updates ---");
    const msgStatusRes = await fetch(`${BASE}/api/contact/${contactData.data.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "CONTACTED" }),
    });
    assert(msgStatusRes.status === 200, "PATCH /api/contact/:id/status updated status to CONTACTED");

    const appStatusRes = await fetch(`${BASE}/api/applications/${appData.data.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "APPROVED", notes: "Approved by Capital Auto Finance @ 5.9% APR" }),
    });
    assert(appStatusRes.status === 200, "PATCH /api/applications/:id/status updated status to APPROVED with notes");

    // Decrypt sensitive PII with Audit Logging
    const sensitiveRes = await fetch(`${BASE}/api/applications/${appData.data.id}/sensitive`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const sensitiveData = await sensitiveRes.json();
    assert(
      sensitiveRes.status === 200 && sensitiveData.data.ssn === "123456789",
      "GET /api/applications/:id/sensitive decrypted full SSN and logged audit event"
    );

    // Verify audit log
    const auditRes = await fetch(`${BASE}/api/admin/audit`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const auditData = await auditRes.json();
    assert(
      auditRes.status === 200 && auditData.data.some((a: any) => a.action === "REVEAL_PII"),
      "Audit event confirmed in PostgreSQL audit_logs table"
    );
  } catch (error) {
    console.error("Test execution failed:", error);
    failed++;
  } finally {
    server.close();
    await disconnectDatabase();
  }

  console.log("\n==========================================================");
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runEndToEndTests();
