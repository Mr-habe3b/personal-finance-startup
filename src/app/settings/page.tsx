import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
      <div className="flex min-h-screen w-full flex-col">
            <AppHeader />
            <main className="flex-1 p-4 sm:px-6 sm:py-8 md:gap-8">
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
      </div>
  );
}
