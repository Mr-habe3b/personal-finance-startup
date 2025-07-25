
'use client';

import { fundraisingDeals as initialDeals, fundraisingStages } from "@/data/mock";
import { FundraisingDeal, FundraisingStage } from "@/types";
import { useState, useMemo, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { FundraisingColumn } from "@/components/fundraising-column";
import { FundraisingCard } from "@/components/fundraising-card";
import { DealForm } from "@/components/deal-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, LineChart, List, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FundraisingPage() {
    const [deals, setDeals] = useState<FundraisingDeal[]>(initialDeals);
    const [activeDeal, setActiveDeal] = useState<FundraisingDeal | null>(null);
    const [selectedDeal, setSelectedDeal] = useState<FundraisingDeal | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );
    
    const analytics = useMemo(() => {
        const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.amount, 0);
        const numberOfDeals = deals.length;
        const averageDealSize = numberOfDeals > 0 ? totalPipelineValue / numberOfDeals : 0;
        const closedDeals = deals.filter(d => d.stage === 'closed').length;
        const closingRatio = numberOfDeals > 0 ? (closedDeals / numberOfDeals) * 100 : 0;
        
        return {
            totalPipelineValue,
            numberOfDeals,
            averageDealSize,
            closingRatio
        }
    }, [deals]);

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
    
    const handleCardClick = (deal: FundraisingDeal) => {
        setSelectedDeal(deal);
        setIsFormOpen(true);
    }

    const handleAddDealClick = () => {
        setSelectedDeal(null);
        setIsFormOpen(true);
    }

    const handleSaveDeal = (dealData: Omit<FundraisingDeal, 'id' | 'stage'>, dealId?: string) => {
        if (dealId) {
            // Update existing deal
            setDeals(currentDeals => 
                currentDeals.map(d => d.id === dealId ? { ...d, ...dealData } : d)
            );
        } else {
            // Add new deal
            const newDeal: FundraisingDeal = {
                id: `deal-${Date.now()}`,
                ...dealData,
                stage: 'lead', // Default stage for new deals
            };
            setDeals(currentDeals => [...currentDeals, newDeal]);
        }
        setIsFormOpen(false);
    }

    const handleDeleteDeal = (dealId: string) => {
        setDeals(currentDeals => currentDeals.filter(d => d.id !== dealId));
        setIsFormOpen(false);
    }

    const handleCancel = () => {
        setIsFormOpen(false);
        setSelectedDeal(null);
    }

    return (
        <>
            <main className="flex-1 overflow-x-auto">
                 <div className="p-4 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Fundraising</h1>
                            <p className="text-muted-foreground">Manage your investor pipeline from lead to close.</p>
                        </div>
                        <Button onClick={handleAddDealClick}>
                            <Plus className="mr-2" />
                            Add Deal
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${analytics.totalPipelineValue.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">Sum of all deal amounts.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                                <List className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.numberOfDeals}</div>
                                <p className="text-xs text-muted-foreground">Total deals in the pipeline.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Deal Size</CardTitle>
                                <LineChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${Math.round(analytics.averageDealSize).toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">Mean value of all deals.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Closing Ratio</CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.closingRatio.toFixed(1)}%</div>
                                <p className="text-xs text-muted-foreground">Percentage of deals closed.</p>
                            </CardContent>
                        </Card>
                    </div>

                    {isMounted && (
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
                                   onCardClick={handleCardClick}
                                />
                           ))}
                        </div>
                         <DragOverlay>
                             {activeDeal ? <FundraisingCard deal={activeDeal} isOverlay /> : null}
                        </DragOverlay>
                    </DndContext>
                    )}
                </div>
                
                {isFormOpen && (
                    <DealForm
                        key={selectedDeal?.id || 'new'}
                        deal={selectedDeal}
                        onSave={handleSaveDeal}
                        onDelete={handleDeleteDeal}
                        onCancel={handleCancel}
                        isOpen={isFormOpen}
                    />
                )}
            </main>
        </>
    );
}
