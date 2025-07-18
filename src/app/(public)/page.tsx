
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, BarChart, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative z-10 text-center px-4 pt-20">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
        Simple invoicing for modern freelancers
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

      <section className="py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About InvoiceMyte</h2>
          <p className="text-muted-foreground text-lg mb-8">
            We're a passionate team dedicated to building tools that empower freelancers and small business owners. We believe that managing your finances should be simple, intuitive, and stress-free. InvoiceMyte was born from the idea that you should be able to focus on what you do best—not on paperwork.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-card/50 p-6 rounded-lg border">
              <Zap className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Efficiency First</h3>
              <p className="text-muted-foreground">Streamline your workflow from creating invoices to getting paid.</p>
            </div>
            <div className="bg-card/50 p-6 rounded-lg border">
              <BarChart className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Financial Clarity</h3>
              <p className="text-muted-foreground">Gain insights into your cash flow and business performance.</p>
            </div>
            <div className="bg-card/50 p-6 rounded-lg border">
              <FileText className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professionalism</h3>
              <p className="text-muted-foreground">Create beautiful, professional documents that impress your clients.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
