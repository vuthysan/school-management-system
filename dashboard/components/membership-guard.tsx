"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

// Public routes that don't require membership check
const PUBLIC_ROUTES = [
	"/auth/get-started",
	"/auth/register-school",
	"/auth/pending-approval",
	"/auth/callback",
];

export function MembershipGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	const {
		memberships,
		hasFetched,
		pendingSchools,
		hasApprovedSchool,
		hasPendingSchoolMembership,
	} = useDashboard();
	const [checked, setChecked] = useState(false);
	const [redirected, setRedirected] = useState(false);

	useEffect(() => {
		// Skip if still loading auth
		if (authLoading) {
			console.log("MembershipGuard: Auth still loading...");
			return;
		}

		// Skip if not authenticated
		if (!isAuthenticated) {
			console.log("MembershipGuard: Not authenticated");
			return;
		}

		// Skip if dashboard data hasn't been fetched yet
		if (!hasFetched) {
			console.log(
				"MembershipGuard: Waiting for dashboard data to be fetched..."
			);
			return;
		}

		// Skip if on a public route
		const isPublicRoute = PUBLIC_ROUTES.some((route) =>
			pathname?.startsWith(route)
		);
		if (isPublicRoute) {
			console.log("MembershipGuard: On public route", pathname);
			setChecked(true);
			return;
		}

		// Skip if already redirected
		if (redirected) return;

		// Check membership and school status
		const hasActiveMembership = memberships && memberships.length > 0;
		const hasPendingSchool = pendingSchools && pendingSchools.length > 0;

		console.log("MembershipGuard: Checking membership status", {
			hasActiveMembership,
			hasApprovedSchool,
			hasPendingSchoolMembership,
			hasPendingSchool,
		});

		// Priority: Check if user has membership but school is pending
		if (hasPendingSchoolMembership) {
			console.log(
				"MembershipGuard: User has membership but school is pending, redirecting to pending-approval"
			);
			setRedirected(true);
			router.replace("/auth/pending-approval");
			return;
		}

		// Check if user has approved school access
		if (hasActiveMembership && hasApprovedSchool) {
			console.log(
				"MembershipGuard: Has active membership with approved school, allowing access"
			);
			setChecked(true);
			return;
		}

		// No membership - check if there's a pending school registration
		if (!hasActiveMembership) {
			if (hasPendingSchool) {
				console.log("MembershipGuard: Redirecting to pending-approval");
				setRedirected(true);
				router.replace("/auth/pending-approval");
			} else {
				console.log("MembershipGuard: Redirecting to get-started");
				setRedirected(true);
				router.replace("/auth/get-started");
			}
		}
	}, [
		isAuthenticated,
		authLoading,
		hasFetched,
		memberships,
		pendingSchools,
		hasApprovedSchool,
		hasPendingSchoolMembership,
		pathname,
		router,
		redirected,
	]);

	// Show loading while auth is loading or data hasn't been fetched
	const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname?.startsWith(r));
	if (
		authLoading ||
		!hasFetched ||
		(!checked && !isPublicRoute && !redirected)
	) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
