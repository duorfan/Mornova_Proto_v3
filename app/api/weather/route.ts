import { NextResponse } from "next/server";

// TODO: Server-side weather lookup. The UI currently fetches Open-Meteo directly
// in TomorrowMorningPanel (no key needed); this seam is reserved for moving that
// server-side and/or using a keyed provider via WEATHER_API_KEY (see .env.example).
export async function GET() {
  return NextResponse.json(
    { status: "todo", message: "Not implemented: weather" },
    { status: 501 }
  );
}
