import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                    Navigate Your Startup&apos;s Equity with Confidence
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    EquityVision provides intuitive tools for founders to manage cap tables, model fundraising rounds, and understand dilution. Make smarter decisions from day one.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/dashboard"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <Image
                src="/images/hero.png"
                width="600"
                height="600"
                alt="Hero"
                data-ai-hint="abstract metallic"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need to manage equity</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From initial splits to fundraising scenarios, we've got you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Cap Table Management</h3>
                <p className="text-muted-foreground">
                  Visualize your ownership structure with an interactive and sortable cap table.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Dilution Simulation</h3>
                <p className="text-muted-foreground">
                  Model future funding rounds and understand the impact on your equity.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Team Equity Allocation</h3>
                <p className="text-muted-foreground">
                  Easily add team members and allocate equity with AI-powered suggestions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center py-6">
        <p className="text-xs text-muted-foreground">&copy; 2024 EquityVision. All rights reserved.</p>
      </footer>
    </div>
  );
}
