"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Settings2,
	Plus,
	X,
	GripVertical,
	Save,
	Loader2,
	BookOpen,
	DoorOpen,
	Calendar,
	CreditCard,
	RotateCcw,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { LoadingState } from "@/components/dashboard/loading-state";
import { useLanguage } from "@/contexts/language-context";
import { useDashboard } from "@/hooks/useDashboard";
import { useLookupValues } from "@/hooks/useLookupValues";

// Lookup key metadata for display
const LOOKUP_KEYS = [
	{
		key: "subject_categories",
		icon: BookOpen,
		color: "text-emerald-600 dark:text-emerald-400",
		bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
	},
	{
		key: "room_types",
		icon: DoorOpen,
		color: "text-blue-600 dark:text-blue-400",
		bgColor: "bg-blue-50 dark:bg-blue-950/40",
	},
	{
		key: "leave_types",
		icon: Calendar,
		color: "text-violet-600 dark:text-violet-400",
		bgColor: "bg-violet-50 dark:bg-violet-950/40",
	},
	{
		key: "payment_methods",
		icon: CreditCard,
		color: "text-amber-600 dark:text-amber-400",
		bgColor: "bg-amber-50 dark:bg-amber-950/40",
	},
];

function LookupCard({
	lookupKey,
	values,
	icon: Icon,
	color,
	bgColor,
	onSave,
}: {
	lookupKey: string;
	values: string[];
	icon: any;
	color: string;
	bgColor: string;
	onSave: (key: string, values: string[]) => Promise<void>;
}) {
	const { t } = useLanguage();
	const [items, setItems] = useState<string[]>(values);
	const [newItem, setNewItem] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const hasChanges =
		JSON.stringify(items) !== JSON.stringify(values);

	const handleAdd = () => {
		const trimmed = newItem.trim();
		if (trimmed && !items.includes(trimmed)) {
			setItems([...items, trimmed]);
			setNewItem("");
		}
	};

	const handleRemove = (index: number) => {
		setItems(items.filter((_, i) => i !== index));
	};

	const handleSave = async () => {
		setIsSaving(true);
		await onSave(lookupKey, items);
		setIsSaving(false);
	};

	const handleReset = () => {
		setItems(values);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAdd();
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card className="liquid-glass-card">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgColor}`}
							>
								<Icon className={`h-4 w-4 ${color}`} />
							</div>
							<div>
								<CardTitle className="text-sm font-semibold">
									{t(`lookup_${lookupKey}`)}
								</CardTitle>
								<p className="text-xs text-muted-foreground mt-0.5">
									{items.length} {t("items")}
								</p>
							</div>
						</div>
						{hasChanges && (
							<div className="flex items-center gap-1.5">
								<Button
									size="sm"
									variant="ghost"
									onClick={handleReset}
									className="h-7 text-xs"
								>
									<RotateCcw className="h-3 w-3 mr-1" />
									{t("reset")}
								</Button>
								<Button
									size="sm"
									onClick={handleSave}
									disabled={isSaving}
									className="h-7 text-xs"
								>
									{isSaving ? (
										<Loader2 className="h-3 w-3 mr-1 animate-spin" />
									) : (
										<Save className="h-3 w-3 mr-1" />
									)}
									{t("save")}
								</Button>
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent className="pt-0">
					{/* Item list */}
					<div className="flex flex-wrap gap-1.5 mb-3">
						<AnimatePresence mode="popLayout">
							{items.map((item, index) => (
								<motion.div
									key={item}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									layout
								>
									<Badge
										variant="secondary"
										className="pl-2 pr-1 py-1 text-xs font-medium gap-1 group"
									>
										<GripVertical className="h-3 w-3 text-muted-foreground/40 hidden" />
										{item}
										<button
											onClick={() => handleRemove(index)}
											className="ml-0.5 rounded-sm p-0.5 hover:bg-destructive/10 hover:text-destructive transition-colors"
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								</motion.div>
							))}
						</AnimatePresence>
					</div>

					{/* Add new item */}
					<div className="flex gap-2">
						<Input
							placeholder={t("add_new_item")}
							value={newItem}
							onChange={(e) => setNewItem(e.target.value)}
							onKeyDown={handleKeyDown}
							className="h-8 text-sm"
						/>
						<Button
							size="sm"
							variant="outline"
							onClick={handleAdd}
							disabled={!newItem.trim()}
							className="h-8 px-3 shrink-0"
						>
							<Plus className="h-3.5 w-3.5" />
						</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

export default function SystemConfigurationPage() {
	const { t } = useLanguage();
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;
	const { lookupMap, isLoading, updateLookupValues } =
		useLookupValues(schoolId);

	if (isLoading) {
		return <LoadingState message={t("loading")} />;
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6 pb-10"
		>
			<PageHeader
				title={t("system_configuration")}
				subtitle={t("system_configuration_desc")}
				icon={Settings2}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{LOOKUP_KEYS.map((config) => (
					<LookupCard
						key={config.key}
						lookupKey={config.key}
						values={lookupMap[config.key] || []}
						icon={config.icon}
						color={config.color}
						bgColor={config.bgColor}
						onSave={updateLookupValues}
					/>
				))}
			</div>
		</motion.div>
	);
}
