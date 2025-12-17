"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { graphqlRequest } from "@/lib/graphql-client";
import { SCHOOL_MUTATIONS } from "@/app/graphql/school";

const SCHOOL_TYPES = [
  { value: "PRIVATE", label: "Private School" },
  { value: "PUBLIC", label: "Public School" },
  { value: "INTERNATIONAL", label: "International School" },
  { value: "NGO", label: "NGO School" },
  { value: "RELIGIOUS", label: "Religious School" },
  { value: "VOCATIONAL", label: "Vocational School" },
];

const EDUCATION_LEVELS = [
  { value: "PRESCHOOL", label: "Preschool" },
  { value: "PRIMARY", label: "Primary School" },
  { value: "SECONDARY", label: "Secondary School" },
  { value: "HIGH_SCHOOL", label: "High School" },
  { value: "VOCATIONAL", label: "Vocational" },
  { value: "UNIVERSITY", label: "University" },
];

export default function RegisterSchoolPage() {
  const { user, getAccessToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [schoolName, setSchoolName] = useState("");
  const [schoolNameKm, setSchoolNameKm] = useState("");
  const [schoolType, setSchoolType] = useState("PRIVATE");
  const [educationLevel, setEducationLevel] = useState("PRIMARY");
  const [description, setDescription] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactPhone, setContactPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!schoolName.trim()) {
      setError("School name is required");
      setLoading(false);

      return;
    }

    try {
      const token = getAccessToken();

      await graphqlRequest(
        SCHOOL_MUTATIONS.REGISTER,
        {
          input: {
            name: schoolName.trim(),
            nameKm: schoolNameKm.trim() || null,
            schoolType,
            educationLevels: [educationLevel],
            description: description.trim() || null,
            address: {
              province: province.trim() || null,
              district: district.trim() || null,
            },
            contact: {
              email: contactEmail.trim() || null,
              phone: contactPhone.trim() || null,
            },
          },
        },
        token,
      );
      setSuccess(true);
      // Redirect to pending approval page after 2 seconds
      setTimeout(() => {
        router.push("/auth/pending-approval");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to register school",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            School Registered Successfully!
          </h1>
          <p className="text-gray-400 mb-4">
            Let&apos;s set up your school profile. This information will be
            submitted for review.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to pending approval page...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Link href="/auth/get-started">
          <Button
            className="mb-6 text-gray-400 hover:text-white"
            variant="ghost"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Get Started
          </Button>
        </Link>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">
                Register Your School
              </CardTitle>
              <CardDescription className="text-gray-400">
                Submit your school for registration. An admin will review and
                approve it.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 bg-red-900/30 rounded-lg border border-red-700">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* School Name */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300" htmlFor="schoolName">
                      School Name (English) *
                    </Label>
                    <Input
                      required
                      className="bg-slate-700/50 border-slate-600 text-white"
                      id="schoolName"
                      placeholder="e.g., Sunrise Academy"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300" htmlFor="schoolNameKm">
                      School Name (Khmer)
                    </Label>
                    <Input
                      className="bg-slate-700/50 border-slate-600 text-white"
                      id="schoolNameKm"
                      placeholder="រាល់ព្រឹកអប់រំ"
                      value={schoolNameKm}
                      onChange={(e) => setSchoolNameKm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Type and Level */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">School Type *</Label>
                    <Select value={schoolType} onValueChange={setSchoolType}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SCHOOL_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Education Level *</Label>
                    <Select
                      value={educationLevel}
                      onValueChange={setEducationLevel}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-gray-300" htmlFor="description">
                    Description
                  </Label>
                  <Textarea
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                    id="description"
                    placeholder="Brief description of your school..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Location */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300" htmlFor="province">
                      Province
                    </Label>
                    <Input
                      className="bg-slate-700/50 border-slate-600 text-white"
                      id="province"
                      placeholder="e.g., Phnom Penh"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300" htmlFor="district">
                      District
                    </Label>
                    <Input
                      className="bg-slate-700/50 border-slate-600 text-white"
                      id="district"
                      placeholder="e.g., Chamkarmon"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300" htmlFor="contactEmail">
                      Contact Email
                    </Label>
                    <Input
                      className="bg-slate-700/50 border-slate-600 text-white"
                      id="contactEmail"
                      placeholder="school@example.com"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300" htmlFor="contactPhone">
                      Contact Phone
                    </Label>
                    <Input
                      className="bg-slate-700/50 border-slate-600 text-white"
                      id="contactPhone"
                      placeholder="+855 12 345 678"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  disabled={loading}
                  type="submit"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit for Review
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Your registration will be reviewed by an administrator.
                  <br />
                  You&apos;ll be notified once approved.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
