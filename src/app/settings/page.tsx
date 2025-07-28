import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Zynoit',
  description: 'Manage your account and application settings.',
};

export default function SettingsPage() {
  return (
      <>
            <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                        <CardDescription>
                            Manage your account and application settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Settings page is under construction.</p>
                    </CardContent>
                </Card>
            </main>
      </>
  );
}
