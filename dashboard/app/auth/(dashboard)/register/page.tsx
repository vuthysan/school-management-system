"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, User, CheckCircle, School, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";

const provinces = [
  "Phnom Penh",
  "Siem Reap",
  "Battambang",
  "Kampong Cham",
  "Kandal",
  "Prey Veng",
  "Kampong Speu",
  "Takeo",
  "Kampot",
  "Pursat",
  "Banteay Meanchey",
  "Svay Rieng",
  "Kampong Thom",
  "Kampong Chhnang",
  "Koh Kong",
  "Kratie",
  "Mondulkiri",
  "Oddar Meanchey",
  "Pailin",
  "Preah Vihear",
  "Ratanakiri",
  "Stung Treng",
  "Tbong Khmum",
  "Kep",
  "Preah Sihanouk",
];

export default function RegisterPage() {
  const router = useRouter();
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    schoolType: "Private",
    address: "",
    province: "",
    district: "",
    phone: "",
    email: "",
    website: "",
    estimatedStudents: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAccessToken();
      const response = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          query: `
            mutation RegisterSchool($input: RegisterSchoolInput!) {
              registerSchool(input: $input) {
                name
                status
                registrationDate
              }
            }
          `,
          variables: {
            input: {
              name: formData.name,
              schoolType: formData.schoolType,
              address: formData.address,
              province: formData.province,
              district: formData.district,
              phone: formData.phone,
              email: formData.email,
              website: formData.website || null,
              ownerName: formData.ownerName,
              ownerEmail: formData.ownerEmail,
              ownerPhone: formData.ownerPhone,
              estimatedStudents: formData.estimatedStudents
                ? parseInt(formData.estimatedStudents)
                : null,
              logoUrl: null,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        alert("Error: " + result.errors[0].message);
      } else {
        router.push("/auth/register/success");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register school. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="max-w-3xl mx-auto">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400 to-purple-500 dark:from-pink-600 dark:to-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-500 dark:from-blue-600 dark:to-cyan-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400 to-indigo-500 dark:from-purple-600 dark:to-indigo-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        {/* Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
          initial={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ scale: 1, rotate: 0 }}
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl blur-xl opacity-60" />
              <div className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-3 rounded-2xl shadow-2xl">
                <School className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Register Your School
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Join Cambodia&apos;s #1 School Platform
                </span>
              </div>
            </div>
          </div>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Transform your school with cutting-edge technology
          </p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-purple-200/50 dark:border-purple-700/50 shadow-2xl p-6 sm:p-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* School Information Section */}
              <div>
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b-2 border-gradient-to-r from-pink-200 via-purple-200 to-blue-200 dark:from-pink-800 dark:via-purple-800 dark:to-blue-800">
                  <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-lg shadow-lg">
                    <Building className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                    School Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* School Name */}
                  <div className="md:col-span-2 space-y-2">
                    <Label
                      className="text-gray-700 dark:text-gray-200 font-semibold text-sm"
                      htmlFor="name"
                    >
                      School Name <span className="text-pink-500">*</span>
                    </Label>
                    <Input
                      required
                      className="h-11 border-purple-200 dark:border-purple-700 focus-visible:ring-purple-500"
                      id="name"
                      placeholder="e.g., International School of Phnom Penh"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>

                  {/* School Type */}
                  <div className="space-y-2">
                    <Label
                      className="text-gray-700 dark:text-gray-200 font-semibold text-sm"
                      htmlFor="schoolType"
                    >
                      School Type <span className="text-pink-500">*</span>
                    </Label>
                    <Select
                      value={formData.schoolType}
                      onValueChange={(value) =>
                        handleChange("schoolType", value)
                      }
                    >
                      <SelectTrigger className="h-11 border-purple-200 dark:border-purple-700 focus:ring-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private">
                          🏫 Private School
                        </SelectItem>
                        <SelectItem value="Public">🏛️ Public School</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estimated Students */}
                  <div className="space-y-2">
                    <Label
                      className="text-gray-700 dark:text-gray-200 font-semibold text-sm"
                      htmlFor="estimatedStudents"
                    >
                      Estimated Students
                    </Label>
                    <div className="relative">
                      <Input
                        className="h-11 border-purple-200 dark:border-purple-700 focus-visible:ring-purple-500"
                        id="estimatedStudents"
                        placeholder="500"
                        type="number"
                        value={formData.estimatedStudents}
                        onChange={(e) =>
                          handleChange("estimatedStudents", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2 space-y-2">
                    <Label
                      className="text-gray-700 dark:text-gray-200 font-semibold text-sm"
                      htmlFor="address"
                    >
                      Complete Address <span className="text-pink-500">*</span>
                    </Label>
                    <div className="relative">
                      <Textarea
                        required
                        className="border-purple-200 dark:border-purple-700 focus-visible:ring-purple-500"
                        id="address"
                        placeholder="Street address, building number, etc."
                        rows={3}
                        value={formData.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Province */}
                  <div className="space-y-2">
                    <Label
                      className="text-gray-700 dark:text-gray-200 font-semibold text-sm"
                      htmlFor="province"
                    >
                      Province <span className="text-pink-500">*</span>
                    </Label>
                    <Select
                      required
                      value={formData.province}
                      onValueChange={(value) => handleChange("province", value)}
                    >
                      <SelectTrigger className="h-11 border-purple-200 dark:border-purple-700 focus:ring-purple-500">
                        <SelectValue placeholder="Select Province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            📍 {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District */}
                  <div className="space-y-2">
                    <Label
                      className="text-gray-700 dark:text-gray-200 font-semibold text-sm"
                      htmlFor="district"
                    >
                      District <span className="text-pink-500">*</span>
                    </Label>
                    <Input
                      required
                      className="h-11 border-purple-200 dark:border-purple-700 focus-visible:ring-purple-500"
                      id="district"
                      placeholder="Enter district"
                      value={formData.district}
                      onChange={(e) => handleChange("district", e.target.value)}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label
                      className="text-gray-700 dark:text-gray-200 font-semibold text-sm"
                      htmlFor="phone"
                    >
                      Phone Number <span className="text-pink-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        required
                        className="h-11 border-purple-200 dark:border-purple-700 focus-visible:ring-purple-500"
                        id="phone"
                        placeholder="+855 12 345 678"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      className="text-gray-700 dark:text-gray-200 font-semibold text-sm"
                      htmlFor="email"
                    >
                      Email Address <span className="text-pink-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        required
                        className="h-11 border-purple-200 dark:border-purple-700 focus-visible:ring-purple-500"
                        id="email"
                        placeholder="school@example.com"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div className="md:col-span-2 space-y-2">
                    <Label
                      className="text-gray-700 dark:text-gray-200 font-semibold text-sm"
                      htmlFor="website"
                    >
                      Website{" "}
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <Input
                        className="h-11 border-purple-200 dark:border-purple-700 focus-visible:ring-purple-500"
                        id="website"
                        placeholder="https://www.yourschool.com"
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          handleChange("website", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Information Section */}
              <div>
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-lg shadow-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    Owner Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Owner Name */}
                  <div className="md:col-span-2 space-y-2">
                    <Label
                      className="text-gray-700 dark:text-gray-200 font-semibold text-sm"
                      htmlFor="ownerName"
                    >
                      Full Name <span className="text-pink-500">*</span>
                    </Label>
                    <Input
                      required
                      className="h-11 border-blue-200 dark:border-blue-700 focus-visible:ring-blue-500"
                      id="ownerName"
                      placeholder="Enter owner's full name"
                      value={formData.ownerName}
                      onChange={(e) =>
                        handleChange("ownerName", e.target.value)
                      }
                    />
                  </div>

                  {/* Owner Email */}
                  <div className="space-y-2">
                    <Label
                      className="text-gray-700 dark:text-gray-200 font-semibold text-sm"
                      htmlFor="ownerEmail"
                    >
                      Email Address <span className="text-pink-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        required
                        className="h-11 border-blue-200 dark:border-blue-700 focus-visible:ring-blue-500"
                        id="ownerEmail"
                        placeholder="owner@example.com"
                        type="email"
                        value={formData.ownerEmail}
                        onChange={(e) =>
                          handleChange("ownerEmail", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Owner Phone */}
                  <div className="space-y-2">
                    <Label
                      className="text-gray-700 dark:text-gray-200 font-semibold text-sm"
                      htmlFor="ownerPhone"
                    >
                      Phone Number <span className="text-pink-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        required
                        className="h-11 border-blue-200 dark:border-blue-700 focus-visible:ring-blue-500"
                        id="ownerPhone"
                        placeholder="+855 12 345 678"
                        type="tel"
                        value={formData.ownerPhone}
                        onChange={(e) =>
                          handleChange("ownerPhone", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-purple-200 dark:border-purple-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-pink-500">*</span> Required fields
                </p>
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                  disabled={loading}
                  size="lg"
                  type="submit"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Registration
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Info Box */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="mt-6 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-700 p-8">
            <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4" />
              What happens next?
            </h3>
            <ul className="space-y-2 text-xs text-purple-800 dark:text-purple-200">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
                <span>Review within 2-3 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
                <span>Email notification with approval status</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
                <span>Start managing your school immediately</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </Card>
  );
}
