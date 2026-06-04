import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const message = searchParams.get("message");

  if (token) {
    const cookieStore = await cookies();
    // Set a secure, HTTP-only cookie for bank-grade session protection
    cookieStore.set("sso_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return NextResponse.redirect(new URL("/about", request.url));
  }

  if (message) {
    return NextResponse.redirect(
      new URL(`/?message=${encodeURIComponent(message)}`, request.url)
    );
  }

  return NextResponse.redirect(new URL("/", request.url));
}
