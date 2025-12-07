"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Logo } from "@/components/icons";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      {/* 
        LEFT SIDE: Introduction & Branding 
      */}
      <div className="flex flex-col lg:flex-row w-full h-full">
        {/* Intro Section - Animated Background */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/2 h-[40%] lg:h-full relative overflow-hidden bg-zinc-950 flex items-center justify-center p-8 text-white z-0"
          initial={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Primary Blue Orb */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 45, 0],
                opacity: [0.4, 0.6, 0.4],
              }}
              className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] rounded-full bg-primary/40 blur-[120px]"
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Secondary Cyan/Blue Orb */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                x: [0, 50, 0],
                opacity: [0.3, 0.5, 0.3],
              }}
              className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/30 blur-[100px]"
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />

            {/* Accent Violet Orb */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                y: [0, -30, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-indigo-600/30 blur-[90px]"
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </div>

          {/* Intro Content */}
          <div className="relative z-10 max-w-lg text-center lg:text-left space-y-8">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
                <Logo className="text-blue-400" size={24} />
                <span className="font-semibold tracking-wide text-blue-50">
                  SMS Platform
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                Empowering <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-indigo-400">
                  Future Education
                </span>
              </h1>

              <p className="hidden lg:block text-lg text-zinc-400 font-light leading-relaxed max-w-md">
                Connect specific tools with a unified platform. Experience
                seamless management for students, teachers, and staff with our
                comprehensive solution.
              </p>

              {/* Feature Pills */}
              <div className="hidden lg:flex flex-wrap gap-3 mt-8">
                {[
                  "Student Management",
                  "Grade Tracking",
                  "Attendance",
                  "Reports",
                ].map((feature, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-300"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Login Section */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/2 h-[60%] lg:h-full bg-background flex flex-col items-center justify-center p-8 lg:p-12 relative z-10"
          initial={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full max-w-sm space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Sign in
              </h2>
              <p className="text-sm text-muted-foreground">
                Welcome back! Please login to your account.
              </p>
            </div>

            <div className="space-y-6">
              <Button
                className="w-full h-14 text-base font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90 text-white rounded-xl"
                size="lg"
                onClick={login}
              >
                Login with KOOMPI ID
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground font-medium">
                    Secure Access
                  </span>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Having trouble?{" "}
                <button
                  type="button"
                  className="underline decoration-primary/50 hover:decoration-primary hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 text-xs text-muted-foreground/60">
            &copy; 2025 Weteka. All rights reserved.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
