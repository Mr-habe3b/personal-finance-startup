import { AppHeader } from "@/components/app-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fundraisingDeals, fundraisingStages } from "@/data/mock";
import { FundraisingCard } from "@/components/fundraising-card";

export default function FundraisingPage() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <AppHeader />
            <main className="flex-1 p-4 md:p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Fundraising Tracker</h1>
                    <p className="text-muted-foreground">Manage your investor pipeline from lead to close.</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {fundraisingStages.map((stage) => (
                        <Card key={stage.id} className="border-0 bg-secondary/50">
                            <CardHeader className="p-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-medium">{stage.title}</CardTitle>
                                    <Badge variant="outline" className="text-sm">{
                                        fundraisingDeals.filter(deal => deal.stage === stage.id).length
                                    }</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="space-y-3">
                                    {fundraisingDeals
                                        .filter(deal => deal.stage === stage.id)
                                        .map(deal => (
                                            <FundraisingCard key={deal.id} deal={deal} />
                                        ))}
                                    {fundraisingDeals.filter(deal => deal.stage === stage.id).length === 0 && (
                                        <div className="text-center text-sm text-muted-foreground py-8">
                                            No deals in this stage.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
