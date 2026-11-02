"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { authClient } from "@/lib/auth-client";
import Navlogo from "./ui/image/logoNav.png";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore-studio", label: "Explore Studio" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about-us", label: "About Us" },
];

const DASHBOARD_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/add-studio", label: "Add New Studio" },
  { href: "/", label: "My Studio Listings" },
];

const navLinkClass = (active: boolean) =>
  `text-[16px] transition hover:text-orange-500 ${active ? "text-orange-500" : ""}`;

const NavBar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  // Close the mobile menu whenever the route changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname intentionally retriggers the effect on navigation.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogOut = async () => {
    await authClient.signOut();
  };
  console.log(typeof(pathname))
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-[85%] items-center justify-between py-2 md:w-[70%]">
        <Link href="/" aria-label="StudioSpace home">
          <Image
            src={Navlogo}
            alt="StudioSpace logo"
            width={1000}
            height={1000}
            className="h-14 w-35"
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 md:flex"
        >
          {NAV_LINKS.map((link, index) => (
            <Link
              key={`${link.href}-${index}`}
              href={link.href}
               className={`px-2 py-1.5 text-[15px] transition hover:text-orange-500 ${
                              pathname === link.href 
                                ? "text-orange-500"
                                : ""
                            }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isPending ? (
            <span className="text-sm text-muted-foreground">Loading…</span>
          ) : session ? (
            <span className="hidden text-sm md:inline">
              Welcome, <span className="font-medium">{session.user.name}</span>
            </span>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="rounded-lg border border-border px-3 py-2 text-sm transition hover:bg-muted"
              >
                LogIn
              </Link>
              <Link
                href="/signin"
                className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                SignUp
              </Link>
            </div>
          )}

          {session && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Avatar>
                      <AvatarImage
                        src={session.user.image ?? undefined}
                        alt={session.user.name ?? "User"}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col gap-3 p-2">
                      <div className="flex flex-col md:hidden">
                        {NAV_LINKS.map((link, index) => (
                          <Link
                            key={`mobile-${link.href}-${index}`}
                            href={link.href}
                            className={`px-2 py-1.5 text-[15px] transition hover:text-orange-500 ${
                              pathname === link.href 
                                ? "text-orange-500"
                                : ""
                            }`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        {DASHBOARD_LINKS.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            className={`px-2 py-1.5 text-[13px] transition hover:text-orange-500 ${
                              pathname === link.href 
                                ? "text-orange-500"
                                : ""
                            }`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="rounded-lg bg-orange-500 px-2 py-1.5 text-sm font-medium text-white transition hover:bg-orange-600"
                        onClick={handleLogOut}
                      >
                        LogOut
                      </button>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Mobile menu toggle (visible when logged out on small screens) */}
          {isPending || !session ? (
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className="rounded-lg border border-border p-2 transition hover:bg-muted md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          ) : null}
        </div>
      </div>

      {/* Mobile menu panel */}
      {isMobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-1 border-t border-border bg-background px-4 py-3 md:hidden"
        >
          {NAV_LINKS.map((link, index) => (
            <Link
              key={`panel-${link.href}-${index}`}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-[15px] transition hover:bg-muted ${
                pathname === link.href && index === 0 ? "text-orange-500" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <>
              {DASHBOARD_LINKS.map((link) => (
                <Link
                  key={`panel-dash-${link.label}`}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-[15px] transition hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={handleLogOut}
                className="mt-1 rounded-lg bg-orange-500 px-3 py-2 text-left text-[15px] font-medium text-white transition hover:bg-orange-600"
              >
                LogOut
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default NavBar;
