"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Building,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Users,
  Globe,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface School {
  id: string;
  name: string;
  schoolType: string;
  address: string;
  province: string;
  district: string;
  phone: string;
  email: string;
  website?: string;
  status: string;
  registrationDate?: string;
  approvedAt?: string;
  rejectionReason?: string;
  estimatedStudents?: number;
}

// Multi-language support
const translations = {
  en: {
    title: "My Schools",
    subtitle: "Manage your school registrations",
    noSchools: "No Schools Registered",
    registerSchool: "Register a School",
    registerMessage:
      "You haven't registered any schools yet. Click below to get started.",
    status: {
      pending: "Pending Review",
      approved: "Approved",
      rejected: "Rejected",
    },
    schoolInfo: "School Information",
    registeredOn: "Registered on",
    approvedOn: "Approved on",
    rejectionReason: "Rejection Reason",
    accessRestricted: "Access Restricted",
    pendingMessage:
      "Your school registration is currently under review. You'll receive an email notification once it's approved.",
    rejectedMessage:
      "Your school registration was rejected. Please review the reason below and submit a new application.",
    approvedMessage:
      "Your school has been approved! You can now access all features.",
    students: "students",
    contactSupport: "Contact Support",
  },
  km: {
    title: "សាលារៀនរបស់ខ្ញុំ",
    subtitle: "គ្រប់គ្រងការចុះឈ្មោះសាលារៀនរបស់អ្នក",
    noSchools: "មិនមានសាលារៀនចុះឈ្មោះ",
    registerSchool: "ចុះឈ្មោះសាលារៀន",
    registerMessage:
      "អ្នកមិនទាន់បានចុះឈ្មោះសាលារៀនណាមួយនៅឡើយទេ។ ចុចខាងក្រោមដើម្បីចាប់ផ្តើម។",
    status: {
      pending: "កំពុងពិនិត្យ",
      approved: "បានអនុម័ត",
      rejected: "បានបដិសេធ",
    },
    schoolInfo: "ព័ត៌មានសាលារៀន",
    registeredOn: "ចុះឈ្មោះនៅ",
    approvedOn: "អនុម័តនៅ",
    rejectionReason: "ហេតុផលនៃការបដិសេធ",
    accessRestricted: "ការចូលប្រើត្រូវបានរឹតបន្តឹង",
    pendingMessage:
      "ការចុះឈ្មោះសាលារៀនរបស់អ្នកកំពុងស្ថិតក្រោមការពិនិត្យ។ អ្នកនឹងទទួលបានការជូនដំណឹងតាមអ៊ីមែលនៅពេលវាត្រូវបានអនុម័ត។",
    rejectedMessage:
      "ការចុះឈ្មោះសាលារៀនរបស់អ្នកត្រូវបានបដិសេធ។ សូមពិនិត្យមើលហេតុផលខាងក្រោម ហើយដាក់ពាក្យស្នើសុំថ្មី។",
    approvedMessage:
      "សាលារៀនរបស់អ្នកត្រូវបានអនុម័ត! ឥឡូវនេះអ្នកអាចចូលប្រើលក្ខណៈពិសេសទាំងអស់បាន។",
    students: "សិស្ស",
    contactSupport: "ទាក់ទងផ្នែកជំនួយ",
  },
};

export default function OwnerSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"en" | "km">("en");

  const t = translations[lang];

  useEffect(() => {
    fetchMySchools();
  }, []);

  const fetchMySchools = async () => {
    try {
      // TODO: Get owner email from auth context
      const ownerEmail = "owner@example.com";

      const response = await fetch("http://localhost:8081/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query MySchools($ownerEmail: String!) {
              mySchools(ownerEmail: $ownerEmail) {
                name
                schoolType
                address
                province
                district
                phone
                email
                website
                status
                registrationDate
                approvedAt
                rejectionReason
                estimatedStudents
              }
            }
          `,
          variables: {
            ownerEmail,
          },
        }),
      });

      const result = await response.json();

      if (result.data?.mySchools) {
        setSchools(result.data.mySchools);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="gap-2 bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100">
            <CheckCircle className="h-4 w-4" />
            {t.status.approved}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="gap-2 bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100">
            <XCircle className="h-4 w-4" />
            {t.status.rejected}
          </Badge>
        );
      default:
        return (
          <Badge className="gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100">
            <Clock className="h-4 w-4" />
            {t.status.pending}
          </Badge>
        );
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 dark:text-green-200">
              {t.approvedMessage}
            </p>
          </div>
        );
      case "rejected":
        return (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">
              {t.rejectedMessage}
            </p>
          </div>
        );
      default:
        return (
          <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4 flex items-start gap-3">
            <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-800 dark:text-orange-200">
              {t.pendingMessage}
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t.subtitle}</p>
        </div>
        <Button
          className="gap-2"
          size="sm"
          variant="outline"
          onClick={() => setLang(lang === "en" ? "km" : "en")}
        >
          <Globe className="h-4 w-4" />
          {lang === "en" ? "ភាសាខ្មែរ" : "English"}
        </Button>
      </motion.div>

      {/* Schools List */}
      {schools.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.noSchools}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t.registerMessage}
            </p>
            <Link href="/register">
              <Button className="gap-2">
                <Building className="h-4 w-4" />
                {t.registerSchool}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {schools.map((school, index) => (
            <motion.div
              key={index}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl">
                        <Building className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-2xl">
                            {school.name}
                          </CardTitle>
                          {getStatusBadge(school.status)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t.registeredOn}:{" "}
                          {school.registrationDate
                            ? new Date(
                                school.registrationDate,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Status Message */}
                  {getStatusMessage(school.status)}

                  {/* School Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {t.schoolInfo}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>
                          {school.province}, {school.district}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4 text-green-500" />
                        <span>{school.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4 text-orange-500" />
                        <span>{school.email}</span>
                      </div>
                      {school.estimatedStudents && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Users className="h-4 w-4 text-purple-500" />
                          <span>
                            ~{school.estimatedStudents} {t.students}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {school.status === "rejected" && school.rejectionReason && (
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {t.rejectionReason}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        {school.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {school.status === "rejected" && (
                    <div className="pt-2">
                      <Link href="/register">
                        <Button className="w-full" variant="outline">
                          {t.registerSchool}
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
