'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for small businesses just starting out",
    features: [
      "limited Invoices",
      "limited Clients",
      "Basic Analytics",
      "No Email Support"
    ],
    highlight: false
  },
  {
    name: "Pro",
    price: "$9.70 / mo",
    description: "For growing businesses that need more power",
    features: [
      "Unlimited Invoices",
      "Unlimited Estimates",
      "Unlimited Credit Notes",
      "Unlimited Clients",
      "Unlimited Items",
      "AI Email Assistant",
      "Ask AI",
      "AI Calendar Planner",
    ],
    highlight: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for large teams",
    features: [
      "Everything in Pro",
      "Dedicated Account Manager",
      "Custom Integrations",
      "24/7 Support"
    ],
    highlight: false
  }
];

export default function PricingPage() {
  const router = useRouter();

  const handleSelectPlan = (planName: string) => {
    if (planName.toLowerCase() === "enterprise") {
      // Scroll to footer contact form
      const contactForm = document.getElementById("contact");
      if (contactForm) {
        contactForm.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Redirect to subscription page for Free and Pro
      router.push(`/subscription?plan=${planName.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center">
        Choose Your Plan
      </h1>
      <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl">
        Simple, transparent pricing for all business sizes. Start for free and upgrade anytime.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan, idx) => (
          <Card
            key={idx}
            className={`shadow-2xl border-2 ${
              plan.highlight ? "border-primary bg-primary/5" : "border-transparent"
            }`}
          >
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {plan.description}
              </CardDescription>
              <p className="text-3xl font-extrabold mt-2">{plan.price}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleSelectPlan(plan.name)}
                size="lg"
                className="w-full mt-6 py-4"
              >
                {plan.highlight ? "Start Pro Plan" : `Select ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-12 text-center max-w-md">
        All plans come with a 7-day free trial. Cancel anytime during the trial period.
      </p>
    </div>
  );
}
