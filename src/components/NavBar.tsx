"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { FolderGit2, Menu, X } from "lucide-react";
import { useState } from "react";

/**
 * Barre de navigation principale de Task Flow.
 * Responsive : affiche un menu burger sur mobile.
 */
export default function NavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Liens de navigation
  const navLinks = [
    { href: "/", label: "Mes projets" },
    { href: "/collaborations", label: "Collaborations" },
  ];

  return (
    <nav className="bg-base-100 border-b border-base-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <FolderGit2 className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">
              Task <span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`btn btn-sm ${
                    isActive ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="ml-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </div>
          </div>

          {/* Bouton burger mobile */}
          <button
            className="md:hidden btn btn-ghost btn-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-base-300 bg-base-100">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`btn btn-sm w-full justify-start ${
                    isActive ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex justify-center pt-2">
              <UserButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}