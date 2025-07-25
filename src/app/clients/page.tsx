
'use client';

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Download, Plus } from "lucide-react";
import type { Client } from "@/types";
import { clients as initialClients } from "@/data/mock";
import { ClientTable } from "@/components/client-table";
import { ClientForm } from "@/components/client-form";
import { useTeam } from "@/context/team-context";

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const { teamMembers } = useTeam();

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
            setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...clientData, id: clientId } : c));
        } else {
            const newClient: Client = {
                id: `client-${Date.now()}`,
                ...clientData,
                projects: []
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
    
    const escapeCsvCell = (cell: string) => `"${(cell || '').replace(/"/g, '""')}"`;

    const handleDownloadCSV = () => {
        if (clients.length === 0) return;

        const headers = [
            'Client ID', 'Company', 'Contact Name', 'Contact Email', 'Status', 'Notes', 'Assigned To',
            'Project ID', 'Project Name', 'Project Description', 'Project Status', 'Project Deadline', 'Project Details'
        ];

        const rows = clients.flatMap(client => {
            const clientData = [
                escapeCsvCell(client.id),
                escapeCsvCell(client.company),
                escapeCsvCell(client.name),
                escapeCsvCell(client.email),
                escapeCsvCell(client.status),
                escapeCsvCell(client.notes),
                escapeCsvCell(client.assignedTo?.join(', ') || ''),
            ];
            
            if (client.projects && client.projects.length > 0) {
                 return client.projects.map(p => {
                    const projectData = [
                        escapeCsvCell(p.id),
                        escapeCsvCell(p.name),
                        escapeCsvCell(p.description),
                        escapeCsvCell(p.status),
                        escapeCsvCell(p.deadline || ''),
                        escapeCsvCell(p.details || ''),
                    ];
                    return [...clientData, ...projectData].join(',');
                });
            }
            // Return one row for clients with no projects
            return [[...clientData, '', '', '', '', '', ''].join(',')];
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `clients-activity-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                        <div className="flex gap-2">
                             <Button onClick={handleDownloadCSV} variant="outline" disabled={clients.length === 0}>
                                <Download className="mr-2 h-4 w-4" />
                                Download CSV
                            </Button>
                            <Button onClick={handleAddClientClick}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Client
                            </Button>
                        </div>
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
                    teamMembers={teamMembers}
                    onSave={handleSaveClient}
                    onDelete={handleDeleteClient}
                    onCancel={handleCancel}
                    isOpen={isFormOpen}
                />
            )}
        </>
    );
}
