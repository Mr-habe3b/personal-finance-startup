
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Milestone, MilestoneCategory } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Calendar, CheckSquare, Target } from "lucide-react";

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
    
    const getCategoryDisplay = (category: MilestoneCategory) => {
        const baseClasses = "text-xs flex items-center gap-1";
        switch (category) {
            case 'task':
                return <span className={cn(baseClasses)}><CheckSquare className="h-3 w-3" /> Task</span>;
            case 'daily':
                return <span className={cn(baseClasses)}><Target className="h-3 w-3" /> Daily Target</span>;
            case 'monthly':
                return <span className={cn(baseClasses)}><Target className="h-3 w-3" /> Monthly Target</span>;
            case 'quarterly':
                return <span className={cn(baseClasses)}><Target className="h-3 w-3" /> Quarterly Target</span>;
            case 'yearly':
                return <span className={cn(baseClasses)}><Target className="h-3 w-3" /> Yearly Target</span>;
            default:
                return null;
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
                <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold leading-snug">{milestone.title}</h4>
                        <Badge variant={getPriorityVariant(milestone.priority)} className="capitalize shrink-0">{milestone.priority}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                        {getCategoryDisplay(milestone.category)}
                    </div>
                    <p className="text-sm text-muted-foreground pt-1">{milestone.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(milestone.dueDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">Owner: {milestone.owner}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
