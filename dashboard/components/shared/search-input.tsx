"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export function SearchInput({
	placeholder = "Search...",
	value,
	onChange,
	className,
}: SearchInputProps) {
	return (
		<div className={cn("relative", className)}>
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
			<Input
				placeholder={placeholder}
				className="pl-10 h-10"
				value={value}
				onChange={onChange ? (e) => onChange(e.target.value) : undefined}
			/>
		</div>
	);
}
