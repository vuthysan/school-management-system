"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
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
import Link from "next/link";
import { useRouter } from "next/navigation";

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
				token
			);
			setSuccess(true);
			// Redirect to pending approval page after 2 seconds
			setTimeout(() => {
				router.push("/auth/pending-approval");
			}, 2000);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to register school"
			);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="text-center"
				>
					<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
						<CheckCircle className="h-10 w-10 text-green-500" />
					</div>
					<h1 className="text-2xl font-bold text-white mb-2">
						School Registered Successfully!
					</h1>
					<p className="text-gray-400 mb-4">
						Your school registration has been submitted for review.
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
						variant="ghost"
						className="mb-6 text-gray-400 hover:text-white"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Get Started
					</Button>
				</Link>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
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
							<form onSubmit={handleSubmit} className="space-y-6">
								{error && (
									<div className="p-3 bg-red-900/30 rounded-lg border border-red-700">
										<p className="text-sm text-red-400">{error}</p>
									</div>
								)}

								{/* School Name */}
								<div className="grid md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="schoolName" className="text-gray-300">
											School Name (English) *
										</Label>
										<Input
											id="schoolName"
											value={schoolName}
											onChange={(e) => setSchoolName(e.target.value)}
											placeholder="e.g., Sunrise Academy"
											className="bg-slate-700/50 border-slate-600 text-white"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="schoolNameKm" className="text-gray-300">
											School Name (Khmer)
										</Label>
										<Input
											id="schoolNameKm"
											value={schoolNameKm}
											onChange={(e) => setSchoolNameKm(e.target.value)}
											placeholder="រាល់ព្រឹកអប់រំ"
											className="bg-slate-700/50 border-slate-600 text-white"
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
									<Label htmlFor="description" className="text-gray-300">
										Description
									</Label>
									<Textarea
										id="description"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Brief description of your school..."
										className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
									/>
								</div>

								{/* Location */}
								<div className="grid md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="province" className="text-gray-300">
											Province
										</Label>
										<Input
											id="province"
											value={province}
											onChange={(e) => setProvince(e.target.value)}
											placeholder="e.g., Phnom Penh"
											className="bg-slate-700/50 border-slate-600 text-white"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="district" className="text-gray-300">
											District
										</Label>
										<Input
											id="district"
											value={district}
											onChange={(e) => setDistrict(e.target.value)}
											placeholder="e.g., Chamkarmon"
											className="bg-slate-700/50 border-slate-600 text-white"
										/>
									</div>
								</div>

								{/* Contact */}
								<div className="grid md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="contactEmail" className="text-gray-300">
											Contact Email
										</Label>
										<Input
											id="contactEmail"
											type="email"
											value={contactEmail}
											onChange={(e) => setContactEmail(e.target.value)}
											placeholder="school@example.com"
											className="bg-slate-700/50 border-slate-600 text-white"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="contactPhone" className="text-gray-300">
											Contact Phone
										</Label>
										<Input
											id="contactPhone"
											value={contactPhone}
											onChange={(e) => setContactPhone(e.target.value)}
											placeholder="+855 12 345 678"
											className="bg-slate-700/50 border-slate-600 text-white"
										/>
									</div>
								</div>

								{/* Submit */}
								<Button
									type="submit"
									disabled={loading}
									className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
								>
									{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Submit for Review
								</Button>

								<p className="text-center text-sm text-gray-500">
									Your registration will be reviewed by an administrator.
									<br />
									You'll be notified once approved.
								</p>
							</form>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
