import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, CandlestickChart, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground/80">
                    Navigate Your Startup&apos;s Equity with Confidence
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    EquityVision provides intuitive tools for founders to manage cap tables, model fundraising rounds, and understand dilution. Make smarter decisions from day one.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="group">
                    <Link href="/login">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x600.png"
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
            <div className="mx-auto grid max-w-sm gap-6 py-12 sm:max-w-4xl sm:grid-cols-2 md:gap-8 lg:max-w-5xl lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Cap Table Management</CardTitle>
                    <PieChart className="h-6 w-6 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Visualize your ownership structure with an interactive and sortable cap table.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-lg font-medium">Dilution Simulation</CardTitle>
                    <CandlestickChart className="h-6 w-6 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Model future funding rounds and understand the impact on your equity.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Team Equity Allocation</CardTitle>
                    <Users className="h-6 w-6 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Easily add team members and allocate equity with AI-powered suggestions.
                  </p>
                </CardContent>
              </Card>
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
