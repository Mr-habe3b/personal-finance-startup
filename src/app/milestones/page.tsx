
'use client';

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { useState } from "react";
import type { Milestone } from "@/types";
import { AddMilestoneForm } from "@/components/add-milestone-form";
import { Card, CardContent } from "@/components/ui/card";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { MilestoneColumn } from "@/components/milestone-column";
import { MilestoneCard } from "@/components/milestone-card";

const milestoneStatuses: Milestone['status'][] = ['todo', 'inprogress', 'done'];

export default function MilestonesPage() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

     const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

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

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const milestone = milestones.find(m => m.id === active.id);
        if (milestone) {
            setActiveMilestone(milestone);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveMilestone(null);
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const activeIndex = milestones.findIndex(m => m.id === active.id);
            const overId = over.id;
            const overIsColumn = milestoneStatuses.includes(overId as any);

            if (overIsColumn) {
                const newStatus = overId as Milestone['status'];
                setMilestones(currentMilestones => {
                    const newMilestones = [...currentMilestones];
                    newMilestones[activeIndex].status = newStatus;
                    return newMilestones;
                });
            }
        }
    };

    return (
        <>
            <AppHeader />
            <main className="flex-1 overflow-x-auto">
                <div className="p-4 md:p-8">
                    <div className="flex items-center justify-between mb-4">
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
                         <DndContext 
                            sensors={sensors}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                {milestoneStatuses.map(status => (
                                    <MilestoneColumn
                                        key={status}
                                        status={status}
                                        milestones={milestones.filter(m => m.status === status)}
                                    />
                                ))}
                            </div>
                            <DragOverlay>
                                {activeMilestone ? <MilestoneCard milestone={activeMilestone} isOverlay /> : null}
                            </DragOverlay>
                        </DndContext>
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
                </div>
                
                <AddMilestoneForm
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddMilestone}
                />
            </main>
        </>
    );
}
