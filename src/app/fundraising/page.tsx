import { AppHeader } from "@/components/app-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fundraisingDeals, fundraisingStages } from "@/data/mock";
import { FundraisingCard } from "@/components/fundraising-card";

export default function FundraisingPage() {
    return (
        <>
            <AppHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold tracking-tight">Fundraising</h1>
                    <p className="text-muted-foreground">Manage your investor pipeline from lead to close.</p>
                </div>
                <div className="grid flex-1 items-start gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {fundraisingStages.map((stage) => (
                        <Card key={stage.id} className="border-0 bg-transparent shadow-none">
                            <CardHeader className="px-4 py-2">
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
        </>
    );
}
