
'use client';

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { useState } from "react";
import type { Milestone } from "@/types";
import { AddMilestoneForm } from "@/components/add-milestone-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const milestoneStatuses: Milestone['status'][] = ['todo', 'inprogress', 'done'];

export default function MilestonesPage() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleAddMilestone = (newMilestone: Omit<Milestone, 'id' | 'status'>) => {
        setMilestones(prev => [
            ...prev,
            {
                id: `ms-${prev.length + 1}`,
                ...newMilestone,
                status: 'todo'
            }
        ]);
        setIsAddModalOpen(false);
    };

    const getStatusVariant = (status: Milestone['status']) => {
        switch (status) {
            case 'done':
                return 'default';
            case 'inprogress':
                return 'secondary';
            case 'todo':
            default:
                return 'outline';
        }
    }
    
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
        <>
            <AppHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Milestones & Targets</h1>
                        <p className="text-muted-foreground">Track your startup's progress with a Kanban-style board.</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Milestone
                    </Button>
                </div>

                {milestones.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        {milestoneStatuses.map(status => (
                            <div key={status} className="bg-muted/50 rounded-lg">
                                <h3 className="text-lg font-semibold p-4 border-b">{getStatusTitle(status)}</h3>
                                <div className="p-4 space-y-4">
                                    {milestones.filter(m => m.status === status).map(milestone => (
                                        <Card key={milestone.id}>
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
                                    ))}
                                    {milestones.filter(m => m.status === status).length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No milestones in this stage.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent>
                            <div className="text-center py-20 flex flex-col items-center">
                                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-semibold text-muted-foreground">No milestones created yet.</p>
                                <p className="text-sm text-muted-foreground">Click "Add Milestone" to set your first target.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
                
                <AddMilestoneForm
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddMilestone}
                />
            </main>
        </>
    );
}
