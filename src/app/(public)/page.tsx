"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/react";

const logos = [
  "/android.png",
  "/meta.png",
  "/microsoft.png",
  "/google.png",
  "/youtube.png",
];

// Logo Carousel Component
function LogoCarousel() {
  return (
    <div className="overflow-hidden relative py-12">
      <div className="flex animate-marquee gap-12 w-max">
        {logos.concat(logos).map((logo, index) => (
          <div key={index} className="flex-shrink-0">
            <Image
              src={logo}
              alt={`Company logo ${index}`}
              width={150}
              height={80}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative z-10 w-full px-4 pt-32 pb-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
              Simple FREE invoicing for Small to Large Businesses
            </h1>
            <p className="max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground mb-8">
              Create and send <b>FREE</b> professional invoices in seconds. Get paid faster and manage your finances with ease.
            </p>
            <div className="flex justify-center lg:justify-start items-center gap-4 mb-12">
              <Button asChild size="lg">
                <Link href="/app">
                  Create Invoice <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="link" size="lg">
                <Link href="#">Learn More</Link>
              </Button>
            </div>
            <div className="flex justify-center lg:justify-start items-center gap-4 text-sm text-muted-foreground mb-16">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> FREE TO USE
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> No credit card required
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <Image
              src="/Macbook.png"
              alt="InvoiceMyte App Screenshot"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Features Section */}
      <div className="relative z-10 w-full py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              What Makes Us Different?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Giving Back Through Simple invoicing with powerful, intuitive tools designed for growth.
            </p>
          </div>

          <div className="space-y-20">
            {/* Feature 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex p-3 rounded-lg border shadow-sm">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Intelligent Automation</h3>
                <p className="text-muted-foreground text-lg">
                  Let AI draft emails, schedule follow-ups, and provide business insights so you can focus on your work, not your paperwork.
                </p>
              </div>
              <div className="animate-fade-in-up delay-200 duration-700">
                <Image
                  src="/phone.png"
                  alt="Intelligent Automation Feature"
                  width={500}
                  height={350}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
              <div className="md:order-2 space-y-4 text-center md:text-left">
                <div className="inline-flex p-3 rounded-lg border shadow-sm">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Unified Document Management</h3>
                <p className="text-muted-foreground text-lg">
                  From invoices and estimates to purchase orders and credit notes, manage your entire financial document workflow in one place.
                </p>
              </div>
              <div className="md:order-1">
                <Image
                  src="/documents.png"
                  alt="Unified Document Management Feature"
                  width={500}
                  height={350}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex p-3 rounded-lg border shadow-sm">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Effortless & Fast</h3>
                <p className="text-muted-foreground text-lg">
                  A clean, intuitive interface designed to get you from creation to paid in record time. No steep learning curves, just results.
                </p>
              </div>
              <div>
                <Image
                  src="/cashflow.png"
                  alt="Effortless & Fast Feature"
                  width={500}
                  height={350}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>


        </div>
      </div>

      <Analytics />
    </div>
  );
}
