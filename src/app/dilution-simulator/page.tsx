import { DilutionSimulatorClient } from "@/components/dilution-simulator-client";
import { capTable } from "@/data/mock";

export default function DilutionSimulatorPage() {
  return (
    <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dilution Impact Simulator</h1>
        <p className="text-muted-foreground mb-8">Use AI to model new funding rounds and understand the dilution effects on existing stakeholders.</p>
        <DilutionSimulatorClient currentCapTable={capTable} />
    </div>
  );
}
