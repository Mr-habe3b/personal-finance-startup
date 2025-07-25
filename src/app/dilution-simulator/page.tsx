import { DilutionSimulatorClient } from "@/components/dilution-simulator-client";
import { capTable } from "@/data/mock";
import { AppHeader } from "@/components/app-header";

export default function DilutionSimulatorPage() {
  return (
      <div className="flex min-h-screen w-full flex-col">
            <AppHeader />
            <main className="flex-1 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Dilution Impact Simulator</h1>
                    <p className="text-muted-foreground mb-6">Use AI to model new funding rounds and understand the dilution effects on existing stakeholders.</p>
                    <DilutionSimulatorClient currentCapTable={capTable} />
                </div>
            </main>
      </div>
  );
}
