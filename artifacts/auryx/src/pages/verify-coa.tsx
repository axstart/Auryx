import { useEffect, useState } from "react";
import { Link } from "wouter";
import { FileText, Search, ShieldCheck } from "lucide-react";
import { applyPageSeo, siteUrl } from "@/lib/seo";

type CoaResult = {
  id: number;
  accession: string;
  productSlug: string;
  productName: string;
  label: string;
  lab: string;
  purity: string | null;
  pdfUrl: string;
  lotNumber: string | null;
};

export default function VerifyCoaPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CoaResult[] | null>(null);

  useEffect(() => {
    return applyPageSeo({
      title: "Verify Certificate of Analysis | Auryx",
      description:
        "Look up Auryx product batch or accession numbers to view the matching Certificate of Analysis (COA).",
      path: "/verify-coa",
      jsonLd: [
        {
          id: "ld-coa-verify",
          data: {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Auryx COA Verification",
            url: siteUrl("/verify-coa"),
            applicationCategory: "BusinessApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
        },
      ],
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 3) {
      setError("Enter at least 3 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch(`/api/coa/verify?q=${encodeURIComponent(q)}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Lookup failed");
        return;
      }
      setResults(body.results ?? []);
    } catch {
      setError("Could not reach verification service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-[#0A0A0A] text-white px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A844]/40">
            <ShieldCheck className="h-6 w-6 text-[#C9A844]" />
          </div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl font-light tracking-wide text-[#C9A844]">
            Verify COA
          </h1>
          <p className="mt-3 text-sm text-white/55 font-['DM_Sans'] leading-relaxed">
            Enter a batch / lot or lab accession number to view the matching Certificate of Analysis.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 2605140082"
              className="min-h-12 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-[#C9A844]/50 focus:outline-none font-['DM_Sans']"
              aria-label="Batch or accession number"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="min-h-12 rounded-lg bg-[#C9A844] px-6 text-sm font-medium uppercase tracking-widest text-black disabled:opacity-50 font-['DM_Sans']"
          >
            {loading ? "Searching…" : "Verify"}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-400 font-['DM_Sans']">{error}</p>}

        {results && results.length === 0 && (
          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-sm text-white/60 font-['DM_Sans']">
              No published COA matched that number. Double-check the accession on your vial label, or{" "}
              <Link href="/contact" className="text-[#C9A844] underline-offset-2 hover:underline">
                contact us
              </Link>
              .
            </p>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="mt-8 space-y-3">
            {results.map((r) => (
              <article
                key={r.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg text-white font-['Cormorant_Garamond']">{r.productName}</h2>
                    <p className="mt-1 text-xs uppercase tracking-wider text-white/40 font-['DM_Sans']">
                      {r.label} · {r.lab}
                    </p>
                  </div>
                  <FileText className="h-5 w-5 shrink-0 text-[#C9A844]/70" />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm font-['DM_Sans']">
                  <div>
                    <dt className="text-white/35 text-xs uppercase tracking-wider">Accession</dt>
                    <dd className="text-white/80">{r.accession}</dd>
                  </div>
                  <div>
                    <dt className="text-white/35 text-xs uppercase tracking-wider">Lot</dt>
                    <dd className="text-white/80">{r.lotNumber ?? r.accession}</dd>
                  </div>
                  {r.purity && (
                    <div>
                      <dt className="text-white/35 text-xs uppercase tracking-wider">Purity</dt>
                      <dd className="text-white/80">{r.purity}</dd>
                    </div>
                  )}
                </dl>
                <a
                  href={r.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex text-sm text-[#C9A844] hover:underline font-['DM_Sans']"
                >
                  View Certificate of Analysis (PDF)
                </a>
                <div className="mt-2">
                  <Link
                    href={`/shop/${r.productSlug}`}
                    className="text-xs text-white/40 hover:text-white/70 font-['DM_Sans']"
                  >
                    View product →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
