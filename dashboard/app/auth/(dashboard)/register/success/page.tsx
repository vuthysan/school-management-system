"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center px-4">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-12 text-center">
          {/* Success Icon */}
          <motion.div
            animate={{ scale: 1 }}
            className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
          </motion.div>

          {/* Title */}
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
          >
            Registration Submitted!
          </motion.h1>

          {/* Description */}
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
          >
            Thank you for registering your school with Cambodia SMS. Your
            application is now under review.
          </motion.p>

          {/* Info Cards */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 text-left"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              What&apos;s Next?
            </h2>
            <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  1
                </div>
                <span>
                  <strong>Review Process:</strong> Our team will review your
                  application within 2-3 business days
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  2
                </div>
                <span>
                  <strong>Email Notification:</strong> Wait for
                  administrator&apos;s approval
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  3
                </div>
                <span>
                  <strong>Get Started:</strong> Once approved, you can login and
                  start managing your school
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              href="/"
            >
              Go to Homepage
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              className="px-6 py-3 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              href="/register"
            >
              Register Another School
            </Link>
          </motion.div>

          {/* Contact Info */}
          <motion.p
            animate={{ opacity: 1 }}
            className="mt-8 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.7 }}
          >
            Questions? Contact us at{" "}
            <a
              className="text-primary hover:underline"
              href="mailto:support@sms.weteka.com"
            >
              support@sms.weteka.com
            </a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
