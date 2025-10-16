"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import tiffinlyBanner from "@/assets/TiffinlyBann.png";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  highlightWhen?: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    highlightWhen: (pathname) => pathname === "/" || pathname === "",
  },
  {
    label: "How it works",
    href: "/#simple-steps",
  },
  {
    label: "Pricing",
    href: "/#subscription-options",
  },
  {
    label: "Menu",
    href: "/#weekly-menu",
  },
  {
    label: "FAQ",
    href: "/faq",
    highlightWhen: (pathname) => pathname === "/faq",
  },
];

const desktopLinkClasses =
  "text-gray-600 hover:text-gray-900 transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-gray-900 after:w-0 hover:after:w-full after:transition-all after:duration-300";

const mobileLinkClasses = "text-gray-600 hover:text-gray-900 transition-colors";

export function PublicHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const renderDesktopLinks = () =>
    NAV_ITEMS.map((item) => {
      const isActive = item.highlightWhen?.(pathname ?? "") ?? false;
      return (
        <Link
          key={item.label}
          href={item.href}
          className={cn(desktopLinkClasses, isActive && "text-gray-900 after:w-full font-medium")}
        >
          {item.label}
        </Link>
      );
    });

  const renderMobileLinks = () =>
    NAV_ITEMS.map((item) => {
      const isActive = item.highlightWhen?.(pathname ?? "") ?? false;
      return (
        <Link
          key={item.label}
          href={item.href}
          className={cn(mobileLinkClasses, isActive && "text-gray-900 font-medium")}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-100 px-3 sm:px-4 pb-1 sm:pb-2"
      style={{
        paddingTop: "max(env(safe-area-inset-top, 0px), 14px)",
        backgroundColor: "#ffffff",
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center justify-center">
          <Link href="/" className="inline-flex items-center">
            <Image
              src={tiffinlyBanner}
              alt="Tiffinly Banner"
              width={116}
              height={38}
              className="rounded-sm"
              priority
            />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center space-x-6">
          {renderDesktopLinks()}
        </nav>

        <div className="lg:hidden flex items-center space-x-2">
          <button onClick={() => setIsMobileMenuOpen((open) => !open)} className="p-1.5">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white border-t border-gray-100 px-3 py-3 sm:px-4"
          style={{ backgroundColor: "#ffffff" }}
        >
          <nav className="flex flex-col space-y-3">{renderMobileLinks()}</nav>
        </motion.div>
      )}
    </motion.header>
  );
}
