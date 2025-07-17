
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AskAIPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Sparkles className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Ask AI</h1>
          <p className="text-muted-foreground">Your general-purpose AI assistant for business questions.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            The Ask AI feature is currently in development. Get ready to ask any business-related question and receive insightful answers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-48 bg-muted rounded-md">
            <p className="text-muted-foreground">A powerful chat interface will be available here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
