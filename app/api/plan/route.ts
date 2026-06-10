import { NextResponse } from "next/server";

// TODO: Device wake-plan. Combines calendar + weather + user rules into a concrete
// schedule (lamp ramp, alarm time, etc.) for the device to execute.
// Method is a placeholder (GET); real contract is likely POST with a request body.
export async function GET() {
  return NextResponse.json(
    { status: "todo", message: "Not implemented: plan" },
    { status: 501 }
  );
}
