import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StudioSpace — Find & book studios by the hour",
    template: "%s · StudioSpace",
  },
  description:
    "StudioSpace connects creators with bookable studios — photography, film, recording, podcast, and more.",
};

// Applies the stored (or system) theme before first paint to avoid a flash
// of the wrong theme. Keep in sync with the key used in ThemeToggle.
const themeScript = `(function(){try{var t=localStorage.getItem("studio-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Static, constant theme-bootstrap script with no user input. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {/* NavBar reads usePathname(), which can't resolve while prerendering
            dynamic routes whose params are only known at request time.
            The skeleton below ships in the static shell and is replaced as
            soon as the real NavBar hydrates. */}
        <Suspense
          fallback={
            <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
              <div className="mx-auto flex w-[85%] items-center justify-between py-2 md:w-[70%]">
                <div className="h-14 w-35 rounded-lg bg-muted" />
                <div className="hidden items-center gap-5 md:flex">
                  <div className="h-4 w-14 rounded bg-muted" />
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-4 w-20 rounded bg-muted" />
                </div>
                <div className="h-9 w-24 rounded-lg bg-muted" />
              </div>
            </header>
          }
        >
          <NavBar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
