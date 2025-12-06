"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Logo } from "@/components/icons";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      {/* 
        LEFT SIDE: Introduction & Branding 
        Visible on large screens, or stacked on top on mobile if desired.
        For this design, we'll keep it as a side-by-side on desktop, 
        and maybe hide or simplify on mobile, or just stack. 
        Let's stack: flex-col on mobile, flex-row on lg.
      */}
      <div className="flex flex-col lg:flex-row w-full h-full">
        
        {/* Intro Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 h-[40vh] lg:h-full relative overflow-hidden bg-black dark:bg-[#0a0a0a] flex items-center justify-center p-8 text-white z-0"
        >
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
               animate={{ 
                 scale: [1, 1.5, 1],
                 rotate: [0, 45, 0],
                 opacity: [0.3, 0.6, 0.3]
               }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary via-violet-600 to-indigo-600 blur-[100px]" 
            />
            <motion.div 
               animate={{ 
                 scale: [1, 1.2, 1],
                 x: [0, 50, 0],
                 opacity: [0.3, 0.5, 0.3]
               }}
               transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-cyan-500 via-primary to-purple-500 blur-[80px]" 
            />
          </div>

          {/* Intro Content */}
          <div className="relative z-10 max-w-lg text-center lg:text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                <Logo size={24} className="text-white" />
                <span className="font-semibold tracking-wide">SMS Platform</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                Empowering <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
                  Future Education
                </span>
              </h1>
              
              <p className="hidden lg:block text-lg text-gray-300 dark:text-gray-400 font-light leading-relaxed mt-6">
                Connect specific tools with a unified platform. 
                Experience seamless management for students, teachers, and staff.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Login Section */}
        <motion.div 
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
           className="w-full lg:w-1/2 h-[60vh] lg:h-full bg-background flex flex-col items-center justify-center p-8 lg:p-12 relative z-10"
        >
           <div className="w-full max-w-sm space-y-8">
              <div className="text-center">
                 <h2 className="text-2xl font-bold tracking-tight">Sign in to School MS</h2>
                 <p className="text-sm text-muted-foreground mt-2">
                   Welcome back! Please login to continue.
                 </p>
              </div>

              <div className="space-y-4">
                 <Button 
                   className="w-full h-12 text-base font-medium shadow-md transition-transform active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90" 
                   size="lg"
                   onClick={login}
                 >
                   Login with KOOMPI ID
                 </Button>

                 <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Secure Access
                      </span>
                    </div>
                  </div>
                  
                   <div className="text-center text-xs text-muted-foreground">
                      Having trouble? <a href="#" className="underline hover:text-primary">Contact Support</a>
                   </div>
              </div>
           </div>
           
           <div className="absolute bottom-6 text-xs text-muted-foreground">
             &copy; 2025 Weteka.
           </div>
        </motion.div>

      </div>
    </div>
  );
}
