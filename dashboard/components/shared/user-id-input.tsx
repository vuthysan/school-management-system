"use client";

import React, { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface UserIdInputProps {
	value: string;
	onChange: (value: string) => void;
	length?: number;
	disabled?: boolean;
	className?: string;
}

export function UserIdInput({
	value,
	onChange,
	length = 8,
	disabled = false,
	className,
}: UserIdInputProps) {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const digits = value.padEnd(length, "").slice(0, length).split("");

	const focusInput = useCallback((index: number) => {
		inputRefs.current[index]?.focus();
	}, []);

	const handleChange = useCallback(
		(index: number, e: React.ChangeEvent<HTMLInputElement>) => {
			const val = e.target.value;

			// Handle paste of multiple digits
			if (val.length > 1) {
				const pasted = val.replace(/\D/g, "").slice(0, length);
				onChange(pasted);
				const nextIndex = Math.min(pasted.length, length - 1);
				setTimeout(() => focusInput(nextIndex), 0);
				return;
			}

			// Only allow digits
			if (val && !/^\d$/.test(val)) return;

			const newDigits = [...digits];
			newDigits[index] = val;
			onChange(newDigits.join("").replace(/ /g, ""));

			// Auto-advance to next box
			if (val && index < length - 1) {
				setTimeout(() => focusInput(index + 1), 0);
			}
		},
		[digits, length, onChange, focusInput]
	);

	const handleKeyDown = useCallback(
		(index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Backspace") {
				if (!digits[index] && index > 0) {
					// If current box is empty, go back and clear previous
					const newDigits = [...digits];
					newDigits[index - 1] = "";
					onChange(newDigits.join("").replace(/ /g, ""));
					setTimeout(() => focusInput(index - 1), 0);
				} else {
					// Clear current box
					const newDigits = [...digits];
					newDigits[index] = "";
					onChange(newDigits.join("").replace(/ /g, ""));
				}
				e.preventDefault();
			} else if (e.key === "ArrowLeft" && index > 0) {
				focusInput(index - 1);
				e.preventDefault();
			} else if (e.key === "ArrowRight" && index < length - 1) {
				focusInput(index + 1);
				e.preventDefault();
			}
		},
		[digits, length, onChange, focusInput]
	);

	const handlePaste = useCallback(
		(e: React.ClipboardEvent) => {
			e.preventDefault();
			const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
			if (pasted) {
				onChange(pasted);
				const nextIndex = Math.min(pasted.length, length - 1);
				setTimeout(() => focusInput(nextIndex), 0);
			}
		},
		[length, onChange, focusInput]
	);

	return (
		<div className={cn("grid grid-cols-8 gap-2 w-full", className)}>
			{Array.from({ length }).map((_, index) => (
				<input
					key={index}
					ref={(el) => { inputRefs.current[index] = el; }}
					type="text"
					inputMode="numeric"
					maxLength={length}
					disabled={disabled}
					value={digits[index]?.trim() || ""}
					onChange={(e) => handleChange(index, e)}
					onKeyDown={(e) => handleKeyDown(index, e)}
					onPaste={handlePaste}
					onFocus={(e) => e.target.select()}
					className={cn(
						"w-full h-12 text-center text-lg font-semibold font-mono rounded-xl",
						"border border-black/10 dark:border-white/10",
						"bg-muted/30 dark:bg-muted/20",
						"text-foreground",
						"focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
						"transition-all duration-150",
						"disabled:opacity-50 disabled:cursor-not-allowed",
						digits[index]?.trim() && "border-primary/30 bg-primary/5 dark:bg-primary/10"
					)}
				/>
			))}
		</div>
	);
}
