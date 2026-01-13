"use client";

import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

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
				width: animate ? (open ? "280px" : "80px") : "280px",
			}}
			className={cn(
				"h-full px-4 py-6 hidden md:flex md:flex-col flex-shrink-0 relative z-50 transition-all duration-300",
				"bg-sidebar backdrop-blur-xl border-r border-white/10 dark:border-white/5 shadow-[5px_0_30px_0_rgba(0,0,0,0.02)]",
				className
			)}
			{...props}
		>
			{children}
			<button
				className="absolute -right-3 top-20 z-50 rounded-full border border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-md p-1.5 shadow-lg hover:bg-white/80 dark:hover:bg-white/10 transition-colors text-primary"
				onClick={() => setOpen(!open)}
			>
				{open ? (
					<ChevronLeft size={14} strokeWidth={3} />
				) : (
					<ChevronRight size={14} strokeWidth={3} />
				)}
			</button>
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
					"h-16 px-6 flex flex-row md:hidden items-center justify-between w-full z-50",
					"bg-sidebar/90 backdrop-blur-xl border-b border-white/10"
				)}
				{...props}
			>
				<div className="flex justify-end z-20 w-full">
					<button
						aria-label="Toggle Menu"
						className="text-foreground cursor-pointer focus:outline-none hover:text-primary transition-colors"
						onClick={() => setOpen(!open)}
					>
						<Menu />
					</button>
				</div>
				<AnimatePresence>
					{open && (
						<motion.div
							animate={{ x: 0, opacity: 1 }}
							className={cn(
								"fixed h-full w-full inset-0 p-8 z-[100] flex flex-col justify-between",
								"bg-background/95 backdrop-blur-2xl",
								className
							)}
							exit={{ x: "-100%", opacity: 0 }}
							initial={{ x: "-100%", opacity: 0 }}
							transition={{
								duration: 0.3,
								ease: "easeInOut",
							}}
						>
							<button
								aria-label="Close Menu"
								className="absolute right-8 top-8 z-50 text-foreground cursor-pointer focus:outline-none hover:text-red-500 transition-colors"
								onClick={() => setOpen(!open)}
							>
								<X />
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
				"flex items-center justify-start gap-4 group/sidebar py-3 px-4 rounded-2xl transition-all smooth-transition relative overflow-hidden",
				active
					? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
					: "hover:bg-primary/10 hover:text-primary text-muted-foreground",
				className
			)}
			href={link.href}
			{...props}
		>
			{/* Active Glow/Shine */}
			{active && (
				<div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover/sidebar:opacity-100 transition-opacity" />
			)}

			{link.icon}
			<motion.span
				animate={{
					display: animate ? (open ? "inline-block" : "none") : "inline-block",
					opacity: animate ? (open ? 1 : 0) : 1,
				}}
				className={cn(
					"text-sm font-medium transition duration-150 whitespace-pre inline-block !p-0 !m-0",
					active && "font-bold tracking-wide"
				)}
			>
				{link.label}
			</motion.span>
		</Link>
	);
};
