
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Milestone, MilestoneCategory } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Calendar, CheckSquare, Clock, Target } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { formatDistanceToNow } from "date-fns";

interface MilestoneCardProps {
    milestone: Milestone;
    isOverlay?: boolean;
    onClick?: (milestone: Milestone) => void;
}

export function MilestoneCard({ milestone, isOverlay, onClick }: MilestoneCardProps) {
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
            <Card className={cn("hover:bg-card/90 cursor-grab", isOverlay && "ring-2 ring-primary")} onClick={() => onClick?.(milestone)}>
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                        <h4 className="font-semibold leading-snug">{milestone.title}</h4>
                        <Badge variant={getPriorityVariant(milestone.priority)} className="capitalize shrink-0">{milestone.priority}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                        {getCategoryDisplay(milestone.category)}
                    </div>
                    <p className="text-sm text-muted-foreground pt-1">{milestone.description}</p>
                    <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(milestone.dueDate).toLocaleDateString()}
                        </span>
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatDistanceToNow(new Date(milestone.lastUpdated), { addSuffix: true })}</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Last updated: {new Date(milestone.lastUpdated).toLocaleString()}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                     <div className="text-xs font-medium text-muted-foreground text-right">Owner: {milestone.owner}</div>
                </CardContent>
            </Card>
        </div>
    );
}
