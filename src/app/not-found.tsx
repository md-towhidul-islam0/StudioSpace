import type { Metadata } from "next";
import NotFound from "@/components/NotFound";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you're looking for doesn't exist or has been moved. Explore studios on StudioSpace instead.",
};

export default function NotFoundPage() {
  return (
    <NotFound
      code="404"
      title="Whoops — this studio doesn't exist"
      description="The page you're looking for doesn't exist — it may have been moved, deleted, or the link is broken. Let's get you back to a studio that does exist."
      primaryAction={{ href: "/", label: "Back to Home" }}
      secondaryAction={{ href: "/explore-studio", label: "Explore Studios" }}
      links={[
        { href: "/explore-studio", label: "Browse Studios" },
        { href: "/add-studio", label: "Host a Studio" },
        { href: "/booking-list", label: "My Bookings" },
        { href: "/login", label: "Log In" },
      ]}
    />
  );
}
