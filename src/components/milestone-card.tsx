
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Milestone, MilestoneCategory } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Calendar, CheckSquare, Clock, Edit, MessageSquare, Target, User, Users } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

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
            <Card className={cn("hover:bg-card/90 cursor-grab group", isOverlay && "ring-2 ring-primary")} onClick={() => onClick?.(milestone)}>
                <CardContent className="p-4 space-y-3 relative">
                     <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <div className="flex justify-between items-start gap-2">
                        <h4 className="font-semibold leading-snug pr-8">{milestone.title}</h4>
                        <Badge variant={getPriorityVariant(milestone.priority)} className="capitalize shrink-0">{milestone.priority}</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground pt-1">{milestone.description}</p>
                    
                     <div className="flex items-center justify-between text-muted-foreground">
                        {getCategoryDisplay(milestone.category)}
                         <span className="flex items-center gap-1 text-xs">
                            <Users className="h-3 w-3" />
                            {milestone.owner.join(', ')}
                        </span>
                    </div>

                    <Separator />
                    
                    <div className="space-y-2 text-xs text-muted-foreground">
                         <div className="flex items-start gap-2">
                            <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                            <p className="flex-1 italic">"{milestone.lastUpdateSummary}"</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {milestone.updatedBy}
                            </span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{formatDistanceToNow(new Date(milestone.lastUpdated), { addSuffix: true })}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                                        <p>Last updated: {new Date(milestone.lastUpdated).toLocaleString()}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
