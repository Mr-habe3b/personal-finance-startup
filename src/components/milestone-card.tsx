
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Milestone } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface MilestoneCardProps {
    milestone: Milestone;
    isOverlay?: boolean;
}

export function MilestoneCard({ milestone, isOverlay }: MilestoneCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: milestone.id,
        data: {
            type: 'milestone',
            milestone,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    const getPriorityVariant = (priority: Milestone['priority']) => {
        switch (priority) {
            case 'high':
                return 'destructive';
            case 'medium':
                return 'secondary';
            case 'low':
            default:
                return 'outline';
        }
    }

    if (isDragging) {
         return (
            <div ref={setNodeRef} style={style} className="opacity-50">
                 <Card className="border-primary">
                    <CardContent className="p-4">
                        <h4 className="font-semibold">{milestone.title}</h4>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className={cn("hover:bg-card/90 cursor-grab", isOverlay && "ring-2 ring-primary")}>
                <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{milestone.title}</h4>
                            <Badge variant={getPriorityVariant(milestone.priority)} className="capitalize">{milestone.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                        <span className="text-xs font-medium text-muted-foreground">Owner: {milestone.owner}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
