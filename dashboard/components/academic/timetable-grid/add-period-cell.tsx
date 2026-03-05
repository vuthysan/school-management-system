"use client";

import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface AddPeriodCellProps {
	onClick: () => void;
}

export function AddPeriodCell({ onClick }: AddPeriodCellProps) {
	const { t } = useLanguage();

	return (
		<button
			type="button"
			onClick={onClick}
			className="group w-full h-9 rounded-lg border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5 flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
		>
			<div className="h-5 w-5 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-primary/15 transition-colors duration-200">
				<Plus className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
			</div>
			<span className="text-[11px] text-muted-foreground group-hover:text-primary transition-colors duration-200 font-medium">
				{t("add_period") || "Add period"}
			</span>
		</button>
	);
}
