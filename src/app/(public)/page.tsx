
"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const plans = {
  monthly: [
    {
      name: 'Free',
      price: '0',
      description: 'Explore and experience.',
      tagline: 'Dive into the possibilities.',
      buttonText: 'Get Started',
    },
    {
      name: 'Starter',
      price: '9.99',
      description: 'Start small, dream big.',
      tagline: 'Unleash your potential.',
      buttonText: 'Get Started',
      mostValued: true,
    },
    {
      name: 'Professional',
      price: '52.00',
      description: 'Seize infinite growth.',
      tagline: 'Elevate your journey.',
      buttonText: 'Get Started',
    },
  ],
  yearly: [
    {
      name: 'Free',
      price: '0',
      description: 'Explore and experience.',
      tagline: 'Dive into the possibilities.',
      buttonText: 'Get Started',
    },
    {
      name: 'Starter',
      price: '7.60',
      originalPrice: '9.99',
      discount: '24',
      description: 'Start small, dream big.',
      tagline: 'Unleash your potential.',
      buttonText: 'Get Started',
      mostValued: true,
    },
    {
      name: 'Professional',
      price: '39.00',
      originalPrice: '52.00',
      discount: '25',
      description: 'Seize infinite growth.',
      tagline: 'Elevate your journey.',
      buttonText: 'Get Started',
    },
  ],
};


export default function Home() {
  const [isYearly, setIsYearly] = useState(true);
  const currentPlans = isYearly ? plans.yearly : plans.monthly;

  return (
    <div className="w-full">
      <div className="relative z-10 w-full px-4 pt-32 pb-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
              Simple invoicing for Small to Large Businesses
            </h1>
            <p className="max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground mb-8">
              Create and send professional invoices in seconds. Get paid faster and manage your finances with ease.
            </p>
            <div className="flex justify-center lg:justify-start items-center gap-4 mb-12">
              <Button asChild size="lg">
                <Link href="/login">
                  Get Started <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="link" size="lg">
                <Link href="#">Learn More</Link>
              </Button>
            </div>
            <div className="flex justify-center lg:justify-start items-center gap-4 text-sm text-muted-foreground mb-16">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> Free to get started
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> No credit card required
              </div>
            </div>
          </div>
           <div className="lg:w-1/2">
             <Image 
                src="https://placehold.co/600x400.png" 
                alt="InvoiceMyte App Screenshot" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-2xl"
                data-ai-hint="app screenshot"
             />
          </div>
        </div>
      </div>
      
      <div className="relative z-10 w-full py-20 px-4">
        <div className="max-w-5xl mx-auto p-8 md:p-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">What Makes Us Different?</h2>
            <p className="mt-4 text-lg text-muted-foreground">Go beyond simple invoicing with powerful, intuitive tools designed for growth.</p>
          </div>

          <div className="space-y-20">
            
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex bg-card/50 p-3 rounded-lg border shadow-sm">
                    <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Intelligent Automation</h3>
                <p className="text-muted-foreground text-lg">Let AI draft emails, schedule follow-ups, and provide business insights so you can focus on your work, not your paperwork.</p>
              </div>
              <div>
                <Image src="https://placehold.co/500x350.png" alt="Intelligent Automation Feature" width={500} height={350} className="rounded-lg shadow-xl" data-ai-hint="automation abstract" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
               <div className="md:order-2 space-y-4 text-center md:text-left">
                <div className="inline-flex bg-card/50 p-3 rounded-lg border shadow-sm">
                    <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Unified Document Management</h3>
                <p className="text-muted-foreground text-lg">From invoices and estimates to purchase orders and credit notes, manage your entire financial document workflow in one place.</p>
              </div>
              <div className="md:order-1">
                <Image src="https://placehold.co/500x350.png" alt="Unified Document Management Feature" width={500} height={350} className="rounded-lg shadow-xl" data-ai-hint="documents organization" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
              <div className="space-y-4 text-center md:text-left">
                 <div className="inline-flex bg-card/50 p-3 rounded-lg border shadow-sm">
                    <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Effortless & Fast</h3>
                <p className="text-muted-foreground text-lg">A clean, intuitive interface designed to get you from creation to paid in record time. No steep learning curves, just results.</p>
              </div>
              <div>
                <Image src="https://placehold.co/500x350.png" alt="Effortless & Fast Feature" width={500} height={350} className="rounded-lg shadow-xl" data-ai-hint="interface speed" />
              </div>
            </div>

          </div>
        </div>
      </div>

       <div className="relative z-10 w-full py-20 px-4">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight">Flexible plans for everyone</h2>
            <p className="mt-4 text-lg text-muted-foreground">Choose a plan that works for you. All plans are backed by our 30-day money-back guarantee.</p>
            <div className="flex items-center justify-center gap-4 mt-6">
                <Label htmlFor="billing-cycle">Monthly</Label>
                <Switch id="billing-cycle" checked={isYearly} onCheckedChange={setIsYearly} />
                <Label htmlFor="billing-cycle">Yearly discount</Label>
                {isYearly && <span className="text-primary font-semibold">Save up to 25%!</span>}
            </div>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentPlans.map((plan, index) => (
              <Card key={index} className={`flex flex-col ${plan.mostValued ? 'border-primary border-2 shadow-2xl' : ''}`}>
                {plan.mostValued && <div className="bg-primary text-primary-foreground text-center text-sm font-semibold py-1 rounded-t-lg">Most Popular</div>}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-4">{plan.tagline}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/ month</span>
                  </div>
                   {plan.originalPrice && <span className="text-muted-foreground line-through">${plan.originalPrice}/month</span>}
                  {plan.discount && <p className="text-sm text-green-600 font-semibold mt-1">Save {plan.discount}%</p>}
                   <p className="text-xs text-muted-foreground mt-2">Billed {isYearly ? 'yearly' : 'monthly'}</p>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/login">{plan.buttonText}</Link>
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
