"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FundraisingDeal } from "@/types";
import { Mail } from "lucide-react";

interface FundraisingCardProps {
    deal: FundraisingDeal;
}

export function FundraisingCard({ deal }: FundraisingCardProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('');
    }

    return (
        <Card className="hover:bg-card/90 cursor-pointer">
            <CardContent className="p-3">
                <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border">
                        <AvatarFallback>{getInitials(deal.investor)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                        <p className="font-semibold">{deal.investor}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                            ${deal.amount.toLocaleString()}
                        </p>
                         <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                            <Mail className="h-3 w-3" />
                            <span>{deal.contact}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
