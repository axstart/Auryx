import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";
import { applyPageSeo } from "@/lib/seo";

export default function NotFound() {
  useEffect(() => {
    return applyPageSeo({
      title: "Page Not Found | Auryx",
      description: "The page you requested could not be found on Auryx.",
      path: "/404",
      noindex: true,
    });
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#0A0A0A] px-4 pt-[var(--site-header-height)]">
      <Card className="w-full max-w-md mx-4 bg-[#111111] border-[#1a1a1a]">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-3 items-center">
            <AlertCircle className="h-8 w-8 text-[#C9A844]" />
            <h1 className="text-2xl font-bold text-white font-serif">404 — Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-white/50">
            The page you are looking for does not exist or has been moved.
          </p>

          <div className="mt-6">
            <Link href="/">
              <span className="text-[#C9A844] text-sm hover:underline cursor-pointer">
                Return to AURYX home
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
