"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Zap,
  Search,
  List,
  Home,
  HelpCircle,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/pricelist", label: "Pricelist", icon: List },
  { href: "/cara-topup", label: "Cara Top Up", icon: HelpCircle },
  { href: "/cek-transaksi", label: "Cek Transaksi", icon: Search },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`navbar transition-all duration-300 ${scrolled ? "shadow-lg" : ""
        }`}
      style={{ zIndex: 50 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Mobile header ── */}
        <div className="flex items-center justify-between h-16 md:hidden relative">
          {/* Spacer to balance the flex container */}
          <div className="w-10"></div>

          {/* Logo */}
          <Link
            href="/"
            id="navbar-logo-mobile"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center"
          >
            <Image
              src="https://res.cloudinary.com/dzojrrwtr/image/upload/v1789888684/logo-crop_wgthak.webp"
              alt="LEGEND STORE"
              width={200}
              height={52}
              className="object-contain drop-shadow-md"
              style={{ height: "52px", width: "auto" }}
              priority
            />
          </Link>

          {/* Right: hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            id="mobile-menu-toggle"
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: menuOpen
                ? "var(--gold-light)"
                : "rgba(255, 255, 255, 0.05)",
              border: menuOpen
                ? "none"
                : "1px solid rgba(255, 255, 255, 0.12)",
              color: menuOpen ? "#0a0a14" : "#f0ece4",
              boxShadow: menuOpen
                ? "0 0 18px rgba(var(--gold-rgb, 200,150,26), 0.5)"
                : "none",
              transition: "all 0.2s ease",
            }}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Desktop header: standard flex layout ── */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" id="navbar-logo">
            <Image
              src="https://res.cloudinary.com/dzojrrwtr/image/upload/v1789888684/logo-crop_wgthak.webp"
              alt="LEGEND STORE"
              width={180}
              height={46}
              className="object-contain"
              style={{ height: "46px", width: "auto" }}
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  id={`navbar-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  style={
                    isActive
                      ? {
                        color: "#ffffff",
                        background: "linear-gradient(135deg, rgba(200,150,26,0.22), rgba(109,40,217,0.18))",
                        border: "1px solid rgba(245,200,66,0.3)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                      }
                      : {
                        color: "rgba(240, 236, 228, 0.65)",
                        border: "1px solid transparent",
                      }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = "#ffffff";
                      (e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = "rgba(240, 236, 228, 0.65)";
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }
                  }}
                >
                  <Icon size={15} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/#games"
              id="navbar-order-cta"
              className="flex items-center gap-2 btn-gold text-sm font-bold tracking-wide"
              style={{ padding: "9px 20px", borderRadius: "12px" }}
            >
              <Zap size={15} />
              Top Up Sekarang
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="md:hidden border-t animate-slide-up"
          style={{
            background: "rgba(10, 10, 20, 0.98)",
            borderColor: "rgba(var(--gold-rgb, 200,150,26), 0.15)",
          }}
        >
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={
                    isActive
                      ? {
                        color: "var(--gold-light)",
                        background:
                          "linear-gradient(135deg, rgba(var(--gold-rgb, 200,150,26), 0.13), rgba(var(--amber-rgb, 212,120,13), 0.07))",
                        borderLeft: "3px solid var(--gold-light)",
                        paddingLeft: "13px",
                      }
                      : {
                        color: "var(--text-muted)",
                      }
                  }
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 mt-2" style={{ borderTop: "1px solid rgba(var(--gold-rgb, 200,150,26), 0.15)" }}>
              <Link
                href="/#order"
                onClick={() => setMenuOpen(false)}
                className="btn-gold w-full text-center text-sm"
                style={{ display: "block", padding: "12px" }}
              >
                ⚡ Top Up Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
