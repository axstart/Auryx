import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";
import { applyPageSeo } from "@/lib/seo";
import { useI18n } from "@/i18n";

export default function NotFound() {
  const { lang, dict } = useI18n();
  const copy = dict.notFound;

  useEffect(() => {
    return applyPageSeo({
      title: copy.seoTitle,
      description: copy.seoDescription,
      path: "/404",
      noindex: true,
    });
  }, [lang, copy.seoTitle, copy.seoDescription]);

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#0A0A0A] px-4 pt-[var(--site-header-height)]">
      <Card className="w-full max-w-md mx-4 bg-[#111111] border-[#1a1a1a]">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-3 items-center">
            <AlertCircle className="h-8 w-8 text-[#C9A844]" />
            <h1 className="text-2xl font-bold text-white font-serif">{copy.title}</h1>
          </div>

          <p className="mt-4 text-sm text-white/50">{copy.body}</p>

          <div className="mt-6">
            <Link href="/">
              <span className="text-[#C9A844] text-sm hover:underline cursor-pointer">
                {copy.homeLink}
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
