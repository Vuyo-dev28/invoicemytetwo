import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, BarChart, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative z-10 text-center px-4 pt-20">
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

      <div className="relative bg-background/50 backdrop-blur-md rounded-xl shadow-2xl p-4 border max-w-5xl mx-auto">
        <Image 
          src="https://placehold.co/1200x600.png"
          alt="InvoiceMyte App Screenshot"
          width={1200}
          height={600}
          className="rounded-lg"
          data-ai-hint="app screenshot"
        />
      </div>
    </div>
  )
}
