"use client";

import Link from "next/link";
import Image from "next/image";
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
        <Link href="/" className="flex items-center">
          <Image
            src="/Wandr_logo.png"
            alt="Wandr"
            width={100}
            height={41}
            priority
            className="h-8"
            style={{ width: "auto" }}
          />
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
