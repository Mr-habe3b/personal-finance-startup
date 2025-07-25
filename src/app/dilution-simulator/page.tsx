import { DilutionSimulatorClient } from "@/components/dilution-simulator-client";
import { capTable } from "@/data/mock";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DilutionSimulatorPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Dilution Impact Simulator</h1>
                <p className="text-muted-foreground mb-8">Use AI to model new funding rounds and understand the dilution effects on existing stakeholders.</p>
                <DilutionSimulatorClient currentCapTable={capTable} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
