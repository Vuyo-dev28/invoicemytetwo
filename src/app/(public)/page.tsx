import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <div className="relative z-10 flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center px-4 pt-24 pb-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
            Simple invoicing for Small to Large Businesses
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
            Create and send professional invoices in seconds. Get paid faster and manage your finances with ease.
          </p>
          <div className="flex justify-center items-center gap-4 mb-12">
            <Button asChild size="lg">
              <Link href="/login">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="link" size="lg">
              <Link href="#">Learn More</Link>
            </Button>
          </div>
          <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground mb-16">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" /> Free to get started
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" /> No credit card required
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 w-full py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">What Makes Us Different?</h2>
            <p className="mt-4 text-lg text-muted-foreground">Go beyond simple invoicing with powerful, intuitive tools designed for growth.</p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="bg-card/50 p-6 rounded-xl border shadow-sm inline-flex">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Intelligent Automation</h3>
                <p className="text-muted-foreground">Let AI draft emails, schedule follow-ups, and provide business insights so you can focus on your work, not your paperwork.</p>
              </div>
            </div>

            <Separator className="my-8" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="bg-card/50 p-6 rounded-xl border shadow-sm inline-flex">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Unified Document Management</h3>
                <p className="text-muted-foreground">From invoices and estimates to purchase orders and credit notes, manage your entire financial document workflow in one place.</p>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="bg-card/50 p-6 rounded-xl border shadow-sm inline-flex">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Effortless & Fast</h3>
                <p className="text-muted-foreground">A clean, intuitive interface designed to get you from creation to paid in record time. No steep learning curves, just results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
