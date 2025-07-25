
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Milestone } from "@/types";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useMemo } from "react";
import { MilestoneCard } from "./milestone-card";

interface MilestoneColumnProps {
    status: Milestone['status'];
    milestones: Milestone[];
}

export function MilestoneColumn({ status, milestones }: MilestoneColumnProps) {
    const milestonesIds = useMemo(() => milestones.map(m => m.id), [milestones]);
    
    const { setNodeRef } = useDroppable({
        id: status,
        data: {
            type: 'column',
            status,
        }
    });

    const getStatusTitle = (status: Milestone['status']) => {
        switch (status) {
            case 'inprogress':
                return 'In Progress';
            case 'todo':
                return 'To Do';
            case 'done':
                return 'Done';
        }
    }

    return (
        <div ref={setNodeRef}>
            <Card className="border-0 bg-secondary shadow-none rounded-lg">
                <CardHeader className="px-4 py-2 border-b">
                    <CardTitle className="text-base font-medium">{getStatusTitle(status)}</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                    <div className="space-y-3 min-h-[100px]">
                        <SortableContext items={milestonesIds}>
                            {milestones.map(milestone => (
                                <MilestoneCard key={milestone.id} milestone={milestone} />
                            ))}
                        </SortableContext>
                        {milestones.length === 0 && (
                            <div className="text-center text-sm text-muted-foreground py-8 px-2">
                                Drag milestones here.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
