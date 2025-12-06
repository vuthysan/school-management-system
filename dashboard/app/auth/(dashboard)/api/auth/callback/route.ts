import { NextRequest, NextResponse } from "next/server";
import { KoompiAuth } from "@koompi/oauth";

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    const auth = new KoompiAuth({
      clientId: process.env.KOOMPI_CLIENT_ID || process.env.NEXT_PUBLIC_KOOMPI_CLIENT_ID || "",
      clientSecret: process.env.KOOMPI_CLIENT_SECRET || "",
      redirectUri: process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
        : "http://localhost:3000/auth/callback",
      baseUrl: "https://oauth.koompi.org",
    });

    // Exchange code for token
    const tokenResponse = await auth.exchangeCode({ code, state });

    // Get user info (cast to any since response type is not fully typed)
    const user = await auth.getUserInfo(tokenResponse.access_token) as any;

    return NextResponse.json({
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      user: {
        id: user.sub || user.id || "",
        email: user.email || "",
        name: user.name || user.preferred_username || "",
        picture: user.picture || undefined,
      },
    });
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Authentication failed" },
      { status: 500 }
    );
  }
}
