
'use client';

import { AppHeader } from "@/components/app-header";
import { fundraisingDeals as initialDeals, fundraisingStages } from "@/data/mock";
import { FundraisingDeal, FundraisingStage } from "@/types";
import { useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { FundraisingColumn } from "@/components/fundraising-column";
import { FundraisingCard } from "@/components/fundraising-card";
import { EditDealForm } from "@/components/edit-deal-form";

export default function FundraisingPage() {
    const [deals, setDeals] = useState<FundraisingDeal[]>(initialDeals);
    const [activeDeal, setActiveDeal] = useState<FundraisingDeal | null>(null);
    const [editingDeal, setEditingDeal] = useState<FundraisingDeal | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const deal = deals.find(d => d.id === active.id);
        if (deal) {
            setActiveDeal(deal);
        }
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeDeal = deals.find(d => d.id === active.id);
        const overItem = over.data.current;

        if (activeDeal && overItem) {
            const overIsColumn = overItem.type === 'stage';
            const overIsDeal = overItem.type === 'deal';

            if (overIsColumn) {
                const overStageId = overItem.stage.id as FundraisingStage;
                if (activeDeal.stage !== overStageId) {
                    const activeIndex = deals.findIndex(d => d.id === active.id);
                    setDeals(currentDeals => {
                        const newDeals = [...currentDeals];
                        newDeals[activeIndex].stage = overStageId;
                        return arrayMove(newDeals, activeIndex, activeIndex);
                    });
                }
            } else if (overIsDeal) {
                const overDeal = overItem.deal as FundraisingDeal;
                if (activeDeal.stage !== overDeal.stage) {
                    const activeIndex = deals.findIndex(d => d.id === active.id);
                    const overIndex = deals.findIndex(d => d.id === over.id);

                    setDeals(currentDeals => {
                        let newDeals = [...currentDeals];
                        newDeals[activeIndex].stage = overDeal.stage;
                        return arrayMove(newDeals, activeIndex, overIndex);
                    });
                }
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
             const activeDeal = deals.find(d => d.id === active.id);
            if (activeDeal) {
                 const overItem = over.data.current;
                 if (overItem && overItem.type === 'stage') {
                    const overStageId = overItem.stage.id as FundraisingStage;
                     if (activeDeal.stage !== overStageId) {
                        const activeIndex = deals.findIndex(d => d.id === active.id);
                        setDeals(currentDeals => {
                            const newDeals = [...currentDeals];
                            newDeals[activeIndex].stage = overStageId;
                            return newDeals;
                        });
                    }
                }
            }
        }
        setActiveDeal(null);
    }
    
    const handleEditDeal = (deal: FundraisingDeal) => {
        setEditingDeal(deal);
    }

    const handleSaveDeal = (updatedDeal: FundraisingDeal) => {
        setDeals(currentDeals => 
            currentDeals.map(d => d.id === updatedDeal.id ? updatedDeal : d)
        );
        setEditingDeal(null);
    }

    const handleCancelEdit = () => {
        setEditingDeal(null);
    }

    return (
        <>
            <AppHeader />
            <main className="flex-1 overflow-x-auto">
                 <div className="p-4 md:p-8">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold tracking-tight">Fundraising</h1>
                        <p className="text-muted-foreground">Manage your investor pipeline from lead to close.</p>
                    </div>
                     <DndContext 
                        sensors={sensors}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                     >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                           {fundraisingStages.map((stage) => (
                               <FundraisingColumn 
                                   key={stage.id} 
                                   stage={stage} 
                                   deals={deals.filter(deal => deal.stage === stage.id)}
                                   onCardClick={handleEditDeal}
                                />
                           ))}
                        </div>
                         <DragOverlay>
                             {activeDeal ? <FundraisingCard deal={activeDeal} isOverlay /> : null}
                        </DragOverlay>
                    </DndContext>
                </div>
                 {editingDeal && (
                    <EditDealForm 
                        deal={editingDeal}
                        onSave={handleSaveDeal}
                        onCancel={handleCancelEdit}
                        isOpen={!!editingDeal}
                    />
                )}
            </main>
        </>
    );
}
