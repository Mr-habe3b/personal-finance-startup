
'use client';

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Client } from "@/types";
import { clients as initialClients } from "@/data/mock";
import { ClientTable } from "@/components/client-table";
import { ClientForm } from "@/components/client-form";

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const handleAddClientClick = () => {
        setSelectedClient(null);
        setIsFormOpen(true);
    };

    const handleEditClientClick = (client: Client) => {
        setSelectedClient(client);
        setIsFormOpen(true);
    };

    const handleSaveClient = (clientData: Omit<Client, 'id'>, clientId?: string) => {
        if (clientId) {
            setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...clientData } : c));
        } else {
            const newClient: Client = {
                id: `client-${Date.now()}`,
                ...clientData,
            };
            setClients(prev => [...prev, newClient]);
        }
        setIsFormOpen(false);
    };

    const handleDeleteClient = (clientId: string) => {
        setClients(prev => prev.filter(c => c.id !== clientId));
        setIsFormOpen(false);
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setSelectedClient(null);
    }

    return (
        <>
            <AppHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Clients</CardTitle>
                            <CardDescription>
                                Manage your client relationships and track their status.
                            </CardDescription>
                        </div>
                         <Button onClick={handleAddClientClick}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Client
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ClientTable 
                            clients={clients} 
                            onEditClient={handleEditClientClick}
                        />
                    </CardContent>
                </Card>
            </main>
             {isFormOpen && (
                <ClientForm
                    key={selectedClient?.id || 'new'}
                    client={selectedClient}
                    onSave={handleSaveClient}
                    onDelete={handleDeleteClient}
                    onCancel={handleCancel}
                    isOpen={isFormOpen}
                />
            )}
        </>
    );
}
