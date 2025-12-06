"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BreadcrumbsTrail() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  const crumbs = parts.map((part, idx) => {
    const href = "/" + parts.slice(0, idx + 1).join("/");
    const label = part.replace(/-/g, " ");

    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-default-500">
      <ol className="flex items-center gap-2">
        <li>
          <Link className="hover:text-foreground" href="/">
            Home
          </Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            <span className="text-default-400">/</span>
            {i < crumbs.length - 1 ? (
              <Link className="hover:text-foreground capitalize" href={c.href}>
                {c.label}
              </Link>
            ) : (
              <span className="capitalize text-foreground">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
