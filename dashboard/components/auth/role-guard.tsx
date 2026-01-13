"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

// Define route permissions
const ROUTE_PERMISSIONS: Record<string, string[]> = {
	// Admin routes - require Admin, Owner, or higher
	"/auth/admin/academic": ["Admin", "Owner", "Director", "DeputyDirector"],
	"/auth/admin/attendance": [
		"Admin",
		"Owner",
		"Director",
		"DeputyDirector",
		"Teacher",
	],
	"/auth/admin/students": ["Admin", "Owner", "Director", "DeputyDirector"],
	"/auth/admin/members": ["Admin", "Owner", "Director"],
	"/auth/admin/finance": ["Admin", "Owner", "Director", "Accountant"],
	"/auth/admin/hr": ["Admin", "Owner", "Director", "HRManager"],
	"/auth/admin/settings": ["Admin", "Owner"],
	"/auth/admin/branches": ["Admin", "Owner"],
	"/auth/admin/exams": [
		"Admin",
		"Owner",
		"Director",
		"DeputyDirector",
		"Teacher",
	],
	"/auth/admin/grading": [
		"Admin",
		"Owner",
		"Director",
		"DeputyDirector",
		"Teacher",
	],
	"/auth/admin/setup": ["Admin", "Owner"],
	// Parent routes
	"/auth/parent": ["Parent"],
	// Student routes
	"/auth/student": ["Student"],
	// Owner routes
	"/auth/owner": ["Owner"],
	// Ministry routes
	"/auth/ministry": ["Ministry"],
};

interface RouteGuardProps {
	children: React.ReactNode;
	requiredRoles?: string[];
	fallbackUrl?: string;
}

export function RouteGuard({
	children,
	requiredRoles,
	fallbackUrl = "/unauthorized",
}: RouteGuardProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { currentRole, isLoading, hasSchools } = useDashboard();

	// Determine required roles from route config or prop
	const effectiveRoles = requiredRoles || ROUTE_PERMISSIONS[pathname] || [];

	useEffect(() => {
		if (isLoading) return;

		// If route requires specific roles
		if (effectiveRoles.length > 0 && currentRole) {
			const hasPermission = effectiveRoles.some(
				(role) => role.toLowerCase() === currentRole.toLowerCase()
			);

			if (!hasPermission) {
				router.push(fallbackUrl);
			}
		}
	}, [isLoading, currentRole, effectiveRoles, router, fallbackUrl]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return <>{children}</>;
}

// Hook for checking permissions in components
export function usePermissions() {
	const { currentRole, currentMembership, isOwner, isAdmin } = useDashboard();

	const hasRole = (role: string | string[]): boolean => {
		if (!currentRole) return false;
		const roles = Array.isArray(role) ? role : [role];
		return roles.some((r) => r.toLowerCase() === currentRole.toLowerCase());
	};

	const hasPermission = (permission: string): boolean => {
		if (!currentMembership) return false;
		return currentMembership.permissions?.includes(permission) ?? false;
	};

	const canAccess = (roles: string[]): boolean => {
		return hasRole(roles);
	};

	return {
		currentRole,
		isOwner,
		isAdmin,
		hasRole,
		hasPermission,
		canAccess,
		// Convenience methods for common role checks
		isTeacher: hasRole("Teacher"),
		isStudent: hasRole("Student"),
		isParent: hasRole("Parent"),
		isDirector: hasRole("Director") || hasRole("DeputyDirector"),
		isAccountant: hasRole("Accountant"),
		isHRManager: hasRole("HRManager"),
	};
}

// Component for conditionally rendering based on role
interface RoleGateProps {
	children: React.ReactNode;
	allowedRoles: string[];
	fallback?: React.ReactNode;
}

export function RoleGate({
	children,
	allowedRoles,
	fallback = null,
}: RoleGateProps) {
	const { hasRole } = usePermissions();

	if (hasRole(allowedRoles)) {
		return <>{children}</>;
	}

	return <>{fallback}</>;
}

// Component for conditionally rendering based on permission
interface PermissionGateProps {
	children: React.ReactNode;
	permission: string;
	fallback?: React.ReactNode;
}

export function PermissionGate({
	children,
	permission,
	fallback = null,
}: PermissionGateProps) {
	const { hasPermission } = usePermissions();

	if (hasPermission(permission)) {
		return <>{children}</>;
	}

	return <>{fallback}</>;
}
