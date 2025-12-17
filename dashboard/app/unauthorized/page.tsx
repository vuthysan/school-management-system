"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-2 border-red-200 dark:border-red-800">
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <motion.div
              animate={{ scale: 1 }}
              className="mb-6"
              initial={{ scale: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <ShieldAlert className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Unauthorized Access
            </h1>

            {/* Message */}
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You don&apos;t have permission to access the requested page. Only
              Super Admins can approve school registrations.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={() => router.push("/auth")}
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
