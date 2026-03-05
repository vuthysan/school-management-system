"use client";

import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface Links {
	label: string;
	href: string;
	icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
	undefined
);

export const useSidebar = () => {
	const context = useContext(SidebarContext);

	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}

	return context;
};

export const SidebarProvider = ({
	children,
	open: openProp,
	setOpen: setOpenProp,
	animate = true,
}: {
	children: React.ReactNode;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	animate?: boolean;
}) => {
	const [openState, setOpenState] = useState(true);

	const open = openProp !== undefined ? openProp : openState;
	const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

	return (
		<SidebarContext.Provider value={{ open, setOpen, animate }}>
			{children}
		</SidebarContext.Provider>
	);
};

export const Sidebar = ({
	children,
	open,
	setOpen,
	animate,
}: {
	children: React.ReactNode;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	animate?: boolean;
}) => {
	return (
		<SidebarProvider animate={animate} open={open} setOpen={setOpen}>
			{children}
		</SidebarProvider>
	);
};

export const SidebarBody = (
	props: React.ComponentProps<typeof motion.div> & {
		children?: React.ReactNode;
	}
) => {
	return (
		<>
			<DesktopSidebar {...props} />
			<MobileSidebar {...(props as React.ComponentProps<"div">)} />
		</>
	);
};

export const DesktopSidebar = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof motion.div> & {
	children?: React.ReactNode;
}) => {
	const { open, setOpen, animate } = useSidebar();

	return (
		<motion.div
			animate={{
				width: animate ? (open ? "252px" : "68px") : "252px",
			}}
			transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
			className={cn(
				"h-full hidden md:flex md:flex-col shrink-0 relative",
				"liquid-glass-surface border-r border-r-black/6 dark:border-r-white/6",
				className
			)}
			{...props}
		>
			<div className="flex flex-col h-full">{children}</div>
		</motion.div>
	);
};

export const MobileSidebar = ({
	className,
	children,
	...props
}: React.ComponentProps<"div">) => {
	const { open, setOpen } = useSidebar();

	return (
		<>
			<div
				className={cn(
					"h-14 px-5 flex flex-row md:hidden items-center justify-between w-full z-50",
					"liquid-glass-surface border-b border-b-black/6 dark:border-b-white/6"
				)}
				{...props}
			>
				<div className="flex justify-end z-20 w-full">
					<button
						aria-label="Toggle Menu"
						className="text-foreground cursor-pointer focus:outline-none hover:text-primary transition-colors"
						onClick={() => setOpen(!open)}
					>
						<Menu size={20} />
					</button>
				</div>
				<AnimatePresence>
					{open && (
						<motion.div
							animate={{ x: 0, opacity: 1 }}
							className={cn(
								"fixed h-full w-full inset-0 p-6 z-[100] flex flex-col justify-between",
								"bg-white dark:bg-background",
								className
							)}
							exit={{ x: "-100%", opacity: 0 }}
							initial={{ x: "-100%", opacity: 0 }}
							transition={{
								duration: 0.25,
								ease: "easeInOut",
							}}
						>
							<button
								aria-label="Close Menu"
								className="absolute right-6 top-6 z-50 text-foreground cursor-pointer focus:outline-none hover:text-destructive transition-colors"
								onClick={() => setOpen(!open)}
							>
								<X size={20} />
							</button>
							{children}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
};

export const SidebarLink = ({
	link,
	className,
	active,
	...props
}: {
	link: Links;
	className?: string;
	active?: boolean;
	props?: LinkProps;
}) => {
	const { open, animate } = useSidebar();

	return (
		<Link
			className={cn(
				"flex items-center gap-2.5 group/sidebar py-2.5 px-3 rounded-lg transition-all duration-150 relative",
				active
					? "bg-primary text-primary-foreground font-medium shadow-sm"
					: "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
				className
			)}
			href={link.href}
			{...props}
		>
			{link.icon}
			<motion.span
				animate={{
					display: animate
						? open
							? "inline-block"
							: "none"
						: "inline-block",
					opacity: animate ? (open ? 1 : 0) : 1,
				}}
				className={cn(
					"text-[13px] whitespace-pre inline-block p-0! m-0! leading-none",
					active ? "font-medium" : "font-normal"
				)}
			>
				{link.label}
			</motion.span>
		</Link>
	);
};
