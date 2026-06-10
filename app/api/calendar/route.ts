import { NextResponse } from "next/server";

// TODO: Wire up Google Calendar. Use GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET /
// GOOGLE_REDIRECT_URI / GOOGLE_REFRESH_TOKEN (see .env.example) to fetch the
// user's next-day events, which the "brain" uses to plan the wake routine.
export async function GET() {
  return NextResponse.json(
    { status: "todo", message: "Not implemented: calendar" },
    { status: 501 }
  );
}
