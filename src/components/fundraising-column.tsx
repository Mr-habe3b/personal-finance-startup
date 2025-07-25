
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FundraisingDeal } from "@/types";
import { FundraisingCard } from "./fundraising-card";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useMemo } from "react";


interface FundraisingColumnProps {
    stage: { id: string, title: string };
    deals: FundraisingDeal[];
}

export function FundraisingColumn({ stage, deals }: FundraisingColumnProps) {
    const dealsIds = useMemo(() => deals.map(d => d.id), [deals]);
    
    const { setNodeRef } = useDroppable({
        id: stage.id,
        data: {
            type: 'stage',
            stage
        }
    });

    return (
        <Card ref={setNodeRef} className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-4 py-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">{stage.title}</CardTitle>
                    <Badge variant="outline" className="text-sm">{deals.length}</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-3 min-h-[100px]">
                    <SortableContext items={dealsIds}>
                        {deals.map(deal => (
                            <FundraisingCard key={deal.id} deal={deal} />
                        ))}
                    </SortableContext>
                     {deals.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground py-8">
                            Drag deals here.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
