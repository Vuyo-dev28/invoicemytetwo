'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function AIEmailPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ai-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.result) {
        setResponse(data.result);
      } else {
        setResponse('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error(error);
      setResponse('Failed to generate email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Sparkles className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI Email Assistant</h1>
          <p className="text-muted-foreground">Your general-purpose AI Email Assistant for business questions.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            The AI Email Assistant feature is currently in development. Get ready to ask any business-related question and receive insightful answers.
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
