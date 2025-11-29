'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <h1 className="text-3xl font-bold">AI Email Assistant</h1>
      <p className="text-muted-foreground">Let AI help you write professional emails in seconds.</p>

      <Card>
        <CardHeader>
          <CardTitle>Generate an Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe the email you want to generate (e.g., Invoice reminder for client)..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate Email'}
          </Button>

          {response && (
            <div className="mt-4 p-4 border rounded bg-muted">
              <h3 className="font-semibold mb-2">Generated Email:</h3>
              <p>{response}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
