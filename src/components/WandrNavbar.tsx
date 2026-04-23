"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { id: "home",    label: "Home",       href: "/" },
  { id: "plan",    label: "Plan a trip", href: "/plan" },
  { id: "explore", label: "Explore",    href: "/explore" },
  { id: "pricing", label: "Pricing",    href: "/pricing" },
  { id: "about",   label: "About",      href: "/about" },
  { id: "blog",    label: "Guides",     href: "/guides" },
];

export default function WandrNavbar() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link className="nav-logo" href="/">
          <span className="mark">W</span>
          <span>
            wandr<span style={{ color: "var(--w-accent)" }}>.</span>
          </span>
        </Link>

        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`nav-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <Link href="/login" className="nav-ghost">
            Sign in
          </Link>
          <Link
            href="/plan"
            className="btn btn-primary"
            style={{ padding: "10px 18px", fontSize: "13px" }}
          >
            Get started →
          </Link>
        </div>
      </div>
    </nav>
  );
}
