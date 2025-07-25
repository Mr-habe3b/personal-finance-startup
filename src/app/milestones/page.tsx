
'use client';

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Target } from "lucide-react";
import { useState } from "react";
import type { Milestone } from "@/types";
import { AddMilestoneForm } from "@/components/add-milestone-form";
import { Badge } from "@/components/ui/badge";

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


    return (
        <>
            <AppHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Milestones & Targets</CardTitle>
                            <CardDescription>
                                Track your startup's progress, set targets, and assign tasks.
                            </CardDescription>
                        </div>
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Milestone
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {milestones.length > 0 ? (
                            <div className="space-y-4">
                                {milestones.map(milestone => (
                                    <div key={milestone.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <h3 className="font-semibold">{milestone.title}</h3>
                                            <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                            <p className="text-xs text-muted-foreground mt-2">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                                        </div>
                                        <Badge variant={getStatusVariant(milestone.status)} className="capitalize">{milestone.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 flex flex-col items-center">
                                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-semibold text-muted-foreground">No milestones created yet.</p>
                                <p className="text-sm text-muted-foreground">Click "Add Milestone" to set your first target.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <AddMilestoneForm
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddMilestone}
                />
            </main>
        </>
    );
}
