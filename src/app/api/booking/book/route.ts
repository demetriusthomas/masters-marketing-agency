import { NextRequest, NextResponse } from "next/server";

const GHL_API_BASE = process.env.GHL_API_BASE!;
const GHL_API_KEY = process.env.GHL_API_KEY!;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID!;
const GHL_USER_ID = process.env.GHL_USER_ID!;

// Validate phone format (basic validation)
function validatePhone(phone: string): string | null {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+${cleaned}`;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      calendarId,
      firstName,
      lastName,
      email,
      phone,
      startTime,
      endTime,
      service,
      address,
      notes,
      tcpaConsent,
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!tcpaConsent) {
      return NextResponse.json(
        { error: "TCPA consent is required" },
        { status: 400 }
      );
    }

    const validatedPhone = validatePhone(phone);
    if (!validatedPhone) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      return NextResponse.json(
        { error: "Booking service not configured" },
        { status: 500 }
      );
    }

    // Step 1: Upsert contact
    const contactRes = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        Version: "2021-04-15",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone: validatedPhone,
        email,
        locationId: GHL_LOCATION_ID,
        source: "Website Booking",
      }),
    });

    const contactData = await contactRes.json();
    const contactId = contactData?.contact?.id;

    if (!contactId) {
      console.error("GHL contact upsert error:", contactData);
      return NextResponse.json(
        { error: "Failed to create contact" },
        { status: 502 }
      );
    }

    // Step 2: Create appointment (DIFFERENT Version header!)
    const title = service
      ? `${firstName} ${lastName} - ${service}`
      : `${firstName} ${lastName} - Consultation`;

    const apptRes = await fetch(`${GHL_API_BASE}/calendars/events/appointments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        Version: "2021-07-28", // MUST be this version for appointments
      },
      body: JSON.stringify({
        calendarId: calendarId || process.env.GHL_CALENDAR_ID,
        locationId: GHL_LOCATION_ID,
        contactId,
        startTime,
        endTime,
        title,
        appointmentStatus: "confirmed",
        assignedUserId: GHL_USER_ID,
        address: address || "",
        notes: notes || "",
      }),
    });

    const apptData = await apptRes.json();

    if (!apptRes.ok) {
      console.error("GHL appointment error:", apptData);
      return NextResponse.json(
        { error: apptData.message || "Failed to book appointment" },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking confirmed! You will receive a confirmation shortly.",
        appointmentId: apptData.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
