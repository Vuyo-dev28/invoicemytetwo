'use client';

import PayPalBtn from "../../../components/PayPalButton";

const CheckIcon = () => (
    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

export default function SubscriptionBlock({ userId }: { userId: string }) {

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 bg-white dark:bg-gray-800 shadow-lg flex flex-col items-center">
      <h3 className="text-2xl font-bold text-center mb-4">Pro Plan</h3>
      <div className="text-center mb-6 h-24 flex flex-col justify-center">
        <div className="text-gray-500 dark:text-gray-600">
          <span className="text-xl line-through">$9.70/month</span>
        </div>
        <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
          7 Day Free Trial
        </p>
        <p className="text-lg font-medium text-muted-foreground mt-1">$0</p>
      </div>
      <ul className="space-y-4 text-gray-700 dark:text-gray-300 self-start mb-8">
        <li className="flex items-center"><CheckIcon /> Unlimited Invoices</li>
        <li className="flex items-center"><CheckIcon /> Unlimited Estimates</li>
        <li className="flex items-center"><CheckIcon /> Unlimited Credit Notes</li>
        <li className="flex items-center"><CheckIcon /> Unlimited Clients</li>
        <li className="flex items-center"><CheckIcon /> Unlimited Items</li>
        <li className="flex items-center"><CheckIcon /> AI Email Assistant</li>
        <li className="flex items-center"><CheckIcon /> Ask AI</li>
        <li className="flex items-center"><CheckIcon /> AI Calendar Planner</li>
      </ul>
      <div className="w-full max-w-sm">
        <PayPalBtn userId={userId} />
      </div>
    </div>
  );
}