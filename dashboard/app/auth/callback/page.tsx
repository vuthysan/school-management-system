"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { KoompiAuth } from "@koompi/oauth";

import { useAuth } from "@/contexts/auth-context";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuth(); // Get setAuth from context
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");

      console.log("code", code);
      

      if (errorParam) {
        setError(errorParam);
        setIsProcessing(false);
        return;
      }

      if (!code) {
        // Only show error if we've finished checking params and truly found nothing
        // But for effect dependencies, this might run early. 
        // Let's assume if no code and no error, maybe we shouldn't error immediately if it's just mounting?
        // But this page is specifically for callback.
        setError("No authorization code received");
        setIsProcessing(false);
        return;
      }

      try {
        // 1. Exchange code for token via Rust backend
        // Note: In production, use an environment variable for the backend URL
        const backendUrl = "http://localhost:8081";

        const response = await fetch(`${backendUrl}/auth/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        });

        console.log("response", response);
        if (response.ok) {
          const data = await response.json();
          // Assuming data matches AuthResponse: { access_token, user, ... }
          setAuth(data.access_token, data.user);
          router.push("/auth");
        } else {
             throw new Error("Failed to exchange token");
        }
      } catch (err) {
        console.error("Callback error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, router, setAuth]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-8">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-destructive text-2xl">✕</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Authentication Failed</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Signing you in...</h1>
        <p className="text-muted-foreground">
          Please wait while we complete authentication.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
