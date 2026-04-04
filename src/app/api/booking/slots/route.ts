import { NextRequest, NextResponse } from "next/server";

const GHL_API_BASE = process.env.GHL_API_BASE!;
const GHL_API_KEY = process.env.GHL_API_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const calendarId = searchParams.get("calendarId") || process.env.GHL_CALENDAR_ID!;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const timezone = searchParams.get("timezone") || "America/Los_Angeles";

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "startDate and endDate are required (epoch milliseconds)" },
      { status: 400 }
    );
  }

  if (!GHL_API_KEY || !GHL_API_BASE) {
    return NextResponse.json(
      { error: "GHL API not configured" },
      { status: 500 }
    );
  }

  const url = `${GHL_API_BASE}/calendars/${calendarId}/free-slots?startDate=${startDate}&endDate=${endDate}&timezone=${encodeURIComponent(timezone)}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        Version: "2021-04-15",
      },
      // Cache for 2 minutes to avoid hammering GHL API
      next: { revalidate: 120 },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("GHL free-slots error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to fetch slots" },
        { status: 502 }
      );
    }

    // Strip traceId, unwrap calendar ID key
    delete data.traceId;
    const slots = data[calendarId] || data;

    return NextResponse.json(slots);
  } catch (error) {
    console.error("GHL API error:", error);
    return NextResponse.json(
      { error: "Failed to connect to booking service" },
      { status: 502 }
    );
  }
}
