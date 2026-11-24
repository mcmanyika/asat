import { Container } from "@/components/shared/Container";

export function DetailPageFallback() {
  return (
    <div aria-hidden>
      <div className="border-b border-border bg-light-bg py-12 md:py-16">
        <Container>
          <div className="h-4 w-48 animate-pulse bg-slate-200" />
          <div className="mt-5 h-10 w-72 max-w-full animate-pulse bg-slate-200" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse bg-slate-200" />
        </Container>
      </div>
      <section className="bg-white py-14 md:py-16">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className="aspect-4/3 animate-pulse border border-border bg-slate-100" />
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse bg-slate-100" />
              <div className="h-4 w-11/12 animate-pulse bg-slate-100" />
              <div className="h-4 w-3/4 animate-pulse bg-slate-100" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
