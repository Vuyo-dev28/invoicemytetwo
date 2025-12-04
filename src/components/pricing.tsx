'use client';

import { Button } from './ui/button';
import Link from 'next/link';

const CheckIcon = () => (
  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold sm:text-5xl text-gray-900">
            Pricing Plans
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Choose the plan that's right for you.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Trial Plan */}
          <div className="border border-blue-500 rounded-lg p-8 flex flex-col bg-card shadow-lg relative">
            <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 rounded-t-lg font-semibold">
              7-Day Trial
            </div>
            <h3 className="text-2xl font-bold mt-8 text-gray-900">Trial</h3>
            <p className="text-gray-500 mt-2">Try everything free for 7 days.</p>
            <div className="mt-4">
              <span className="text-5xl font-extrabold text-gray-900">$0</span>
              <span className="text-gray-500"> / month</span>
            </div>
            <p className="text-gray-500 mt-1">Billed monthly</p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center text-gray-900"><CheckIcon /> Unlimited Invoices</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> Unlimited Estimates</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> Unlimited Credit Notes</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> Unlimited Clients</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> Unlimited Items</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> AI Email Assistant</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> Ask AI</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> AI Calendar Planner</li>
            </ul>
            <div className="mt-auto pt-8">
              <Button asChild className="w-full">
                <Link href="/subscription">Start Free Trial</Link>
              </Button>
            </div>
          </div>

          {/* Professional Plan */}
          <div className="border border-gray-200 rounded-lg p-8 flex flex-col bg-card shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900">Professional</h3>
            <p className="text-gray-500 mt-2">For established businesses and power users.</p>
            <div className="mt-4">
              <span className="text-5xl font-extrabold text-gray-900">$7.50</span>
              <span className="text-gray-500"> / month</span>
            </div>
            <p className="text-gray-500 mt-1">Billed monthly</p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center text-gray-900"><CheckIcon /> Unlimited Invoices</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> Unlimited Estimates</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> Unlimited Credit Notes</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> Unlimited Clients</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> Unlimited Items</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> AI Email Assistant</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> Ask AI</li>
              <li className="flex items-center text-gray-900"><CheckIcon /> AI Calendar Planner</li>
            </ul>
            <div className="mt-auto pt-8">
                <Button asChild className="w-full">
                    <Link href="/subscription">Get Started</Link>
                </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
