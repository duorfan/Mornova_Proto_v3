import { NextResponse } from "next/server";

// TODO: LLM reasoning. Turns calendar + weather + rules into the natural-language
// "smart tips" shown in the UI. Uses ANTHROPIC_API_KEY (see .env.example); the
// provider can be swapped for another LLM.
// Method is a placeholder (GET); real contract is likely POST with a request body.
export async function GET() {
  return NextResponse.json(
    { status: "todo", message: "Not implemented: reason" },
    { status: 501 }
  );
}
