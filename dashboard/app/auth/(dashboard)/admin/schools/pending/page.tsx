"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

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
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  estimatedStudents?: number;
  status: string;
  registrationDate?: string;
}

// Multi-language support
const translations = {
  en: {
    title: "Pending School Registrations",
    subtitle: "Review and approve school applications",
    pending: "Pending",
    search: "Search schools...",
    noSchools: "No Pending Schools",
    allProcessed: "All school registrations have been processed",
    approve: "Approve",
    reject: "Reject",
    schoolInfo: "School Information",
    ownerInfo: "Owner Information",
    students: "students",
    rejectTitle: "Reject School",
    rejectReason: "Please provide a reason for rejection:",
    rejectPlaceholder: "Enter rejection reason...",
    cancel: "Cancel",
    confirmReject: "Confirm Rejection",
    rejecting: "Rejecting...",
    schoolType: "School Type",
    private: "Private",
    public: "Public",
    unauthorized: "Unauthorized Access",
    unauthorizedMessage: "You don't have permission to access this page. Only Super Admins can approve school registrations.",
  },
  km: {
    title: "ការចុះឈ្មោះសាលារៀនដែលរង់ចាំ",
    subtitle: "ពិនិត្យ និងអនុម័តពាក្យស្នើសុំ",
    pending: "រង់ចាំ",
    search: "ស្វែងរកសាលារៀន...",
    noSchools: "គ្មានសាលារៀនរង់ចាំ",
    allProcessed: "ការចុះឈ្មោះសាលារៀនទាំងអស់ត្រូវបានដំណើរការ",
    approve: "អនុម័ត",
    reject: "បដិសេធ",
    schoolInfo: "ព័ត៌មានសាលារៀន",
    ownerInfo: "ព័ត៌មានម្ចាស់",
    students: "សិស្ស",
    rejectTitle: "បដិសេធសាលារៀន",
    rejectReason: "សូមផ្តល់ហេតុផលនៃការបដិសេធ:",
    rejectPlaceholder: "បញ្ចូលហេតុផលនៃការបដិសេធ...",
    cancel: "បោះបង់",
    confirmReject: "បញ្ជាក់ការបដិសេធ",
    rejecting: "កំពុងបដិសេធ...",
    schoolType: "ប្រភេទសាលា",
    private: "ឯកជន",
    public: "រដ្ឋ",
    unauthorized: "មិនមានសិទ្ធិចូលប្រើ",
    unauthorizedMessage: "អ្នកមិនមានសិទ្ធិចូលប្រើទំព័រនេះទេ។ មានតែ Super Admin ទេដែលអាចអនុម័តការចុះឈ្មោះសាលារៀន។",
  },
};

export default function PendingSchoolsPage() {
  const router = useRouter();
  const { isSuperAdmin, getAccessToken } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "km">("en");

  const t = translations[lang];

  useEffect(() => {
    // Check if user is SuperAdmin
    if (!isSuperAdmin()) {
      router.push("/unauthorized");
      return;
    }
    fetchPendingSchools();
  }, [isSuperAdmin, router]);

  const fetchPendingSchools = async () => {
    try {
      const token = getAccessToken();
      const response = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({
          query: `
            query {
              pendingSchools {
                name
                schoolType
                address
                province
                district
                phone
                email
                website
                ownerName
                ownerEmail
                ownerPhone
                estimatedStudents
                status
                registrationDate
              }
            }
          `,
        }),
      });

      const result = await response.json();
      if (result.data?.pendingSchools) {
        setSchools(result.data.pendingSchools);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (school: School) => {
    setActionLoading(true);
    try {
      const token = getAccessToken();
      const response = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({
          query: `
            mutation ApproveSchool($input: ApproveSchoolInput!) {
              approveSchool(input: $input) {
                name
                status
              }
            }
          `,
          variables: {
            input: {
              schoolId: school.id,
            },
          },
        }),
      });

      const result = await response.json();
      if (!result.errors) {
        alert(`${school.name} has been approved!`);
        fetchPendingSchools();
        setSelectedSchool(null);
      }
    } catch (error) {
      console.error("Error approving school:", error);
      alert("Failed to approve school");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (school: School) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setActionLoading(true);
    try {
      const token = getAccessToken();
      const response = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({
          query: `
            mutation RejectSchool($input: RejectSchoolInput!) {
              rejectSchool(input: $input) {
                name
                status
              }
            }
          `,
          variables: {
            input: {
              schoolId: school.id,
              rejectionReason: rejectionReason,
            },
          },
        }),
      });

      const result = await response.json();
      if (!result.errors) {
        alert(`${school.name} has been rejected`);
        fetchPendingSchools();
        setSelectedSchool(null);
        setRejectionReason("");
      }
    } catch (error) {
      console.error("Error rejecting school:", error);
      alert("Failed to reject school");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === "en" ? "km" : "en")}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            {lang === "en" ? "ភាសាខ្មែរ" : "English"}
          </Button>
          
          {/* Pending Count Badge */}
          <Badge variant="secondary" className="gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100">
            <Clock className="h-4 w-4" />
            <span className="font-semibold">{schools.length} {t.pending}</span>
          </Badge>
        </div>
      </motion.div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Schools List */}
      {filteredSchools.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-8 w-8 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.noSchools}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.allProcessed}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSchools.map((school, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-xl">
                        <Building className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{school.name}</CardTitle>
                          <Badge variant={school.schoolType === "Private" ? "default" : "secondary"}>
                            {school.schoolType === "Private" ? `🏫 ${t.private}` : `🏛️ ${t.public}`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* School Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {t.schoolInfo}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>{school.province}, {school.district}</span>
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
                          <span>~{school.estimatedStudents} {t.students}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Owner Information */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t.ownerInfo}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>{school.ownerName}</strong> • {school.ownerEmail} • {school.ownerPhone}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleApprove(school)}
                      disabled={actionLoading}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t.approve}
                    </Button>
                    <Button
                      onClick={() => setSelectedSchool(school)}
                      disabled={actionLoading}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {t.reject}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {selectedSchool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-red-600 dark:text-red-400">
                  {t.rejectTitle}: {selectedSchool.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="rejectionReason" className="text-sm font-semibold mb-2">
                    {t.rejectReason}
                  </Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    placeholder={t.rejectPlaceholder}
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setSelectedSchool(null);
                      setRejectionReason("");
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    {t.cancel}
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedSchool)}
                    disabled={actionLoading || !rejectionReason.trim()}
                    variant="destructive"
                    className="flex-1"
                  >
                    {actionLoading ? t.rejecting : t.confirmReject}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
