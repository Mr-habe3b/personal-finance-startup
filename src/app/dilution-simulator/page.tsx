import { DilutionSimulatorClient } from "@/components/dilution-simulator-client";
import { capTable } from "@/data/mock";
import { AppHeader } from "@/components/app-header";

export default function DilutionSimulatorPage() {
  return (
      <>
            <AppHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Dilution Impact Simulator</h1>
                    <p className="text-muted-foreground mb-6">Use AI to model new funding rounds and understand the dilution effects on existing stakeholders.</p>
                    <DilutionSimulatorClient currentCapTable={capTable} />
                </div>
            </main>
      </>
  );
}
