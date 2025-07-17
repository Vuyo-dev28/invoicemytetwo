
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AIPlannerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <CalendarDays className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI Calendar Planner</h1>
          <p className="text-muted-foreground">Organize your week with smart suggestions from AI.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            The AI Calendar Planner is being built. Soon you'll be able to plan your tasks, meetings, and deadlines intelligently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-48 bg-muted rounded-md">
            <p className="text-muted-foreground">An interactive calendar planner will be available here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
