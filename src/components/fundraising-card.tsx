
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FundraisingDeal } from "@/types";
import { Mail } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface FundraisingCardProps {
    deal: FundraisingDeal;
    isOverlay?: boolean;
}

export function FundraisingCard({ deal, isOverlay }: FundraisingCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: deal.id,
        data: {
            type: 'deal',
            deal,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };


    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('');
    }

    if (isDragging) {
         return (
            <div ref={setNodeRef} style={style} className="opacity-50">
                 <Card className="border-primary">
                    <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                             <Avatar className="h-10 w-10 border">
                                <AvatarFallback>{getInitials(deal.investor)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <p className="font-semibold">{deal.investor}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className={cn("hover:bg-card/90 cursor-grab", isOverlay && "ring-2 ring-primary")}>
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
        </div>
    );
}
