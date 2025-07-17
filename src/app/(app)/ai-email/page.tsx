
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function AIEmailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mail className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI Email Assistant</h1>
          <p className="text-muted-foreground">Let AI help you write professional emails in seconds.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            The AI Email Assistant is under construction. Soon you'll be able to draft emails for invoices, follow-ups, and client communication effortlessly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-48 bg-muted rounded-md">
            <p className="text-muted-foreground">Email assistant functionality will be available here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
