"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import clsx from "clsx";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Check Claim" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/appeals", label: "Appeals" },
  ];

  return (
    <header className="fixed top-4 left-0 w-full z-50 px-4 flex justify-center pointer-events-none">
      <nav className="glass-card rounded-full px-6 py-3 flex items-center gap-8 pointer-events-auto">
        <Link href="/" className="flex items-center gap-2 text-primary-dark dark:text-primary-light font-bold text-xl font-[family-name:var(--font-fredoka)]">
          <ShieldCheck className="w-6 h-6 text-success" />
          ClaimGuard
        </Link>
        <div className="flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary text-white"
                  : "hover:bg-primary-light/50 dark:hover:bg-primary-dark/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
