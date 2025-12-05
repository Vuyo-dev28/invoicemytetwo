'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Zap } from "lucide-react";
import { createClient } from '@/utils/supabase/client';

export default function StartTrialPage() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartTrial = async () => {
    setIsStarting(true);
    // Redirect to subscription page to start the trial
    router.push('/subscription');
  };

  const handleSkip = () => {
    // Skip trial and go to dashboard
    router.push('/dashboard?new_user=true');
  };

  const features = [
    'Unlimited Invoices',
    'Unlimited Estimates',
    'Unlimited Credit Notes',
    'Unlimited Clients',
    'Unlimited Items',
    'AI Email Assistant',
    'Ask AI',
    'AI Calendar Planner',
    'Advanced Analytics & Reports',
    'Priority Support'
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-8">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold">Start Your Free Trial</CardTitle>
          <CardDescription className="text-lg">
            Get unlimited access to all features for 7 days.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/5 rounded-lg p-6 border-2 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Your Trial Includes:</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Unlimited everything</strong> during your trial period. 
              Cancel anytime - no charges until the trial ends.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleStartTrial}
              disabled={isStarting}
              className="flex-1 text-lg py-6"
              size="lg"
            >
              {isStarting ? 'Starting...' : 'START FREE TRIAL'}
            </Button>
            <Button
              onClick={handleSkip}
              variant="outline"
              disabled={isStarting}
              className="flex-1 text-lg py-6"
              size="lg"
            >
              Skip for Now
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By starting your trial, you agree to our Terms of Service and Privacy Policy.
            You can cancel anytime during the trial period.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

