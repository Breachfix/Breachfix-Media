// Handles requests to /.well-known/* and responds with 204 No Content
import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(null, { status: 204 }); // No Content
}
