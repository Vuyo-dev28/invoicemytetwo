import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function Home() {
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
    </div>
  )
}
