'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Send, HelpCircle, MessageSquare, Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SupportPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [enquiryType, setEnquiryType] = useState('General Inquiry');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const validate = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required.';
    }

    setErrors(newErrors);

    if (newErrors.email && emailRef.current) emailRef.current.focus();
    else if (newErrors.message && messageRef.current) messageRef.current.focus();

    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;

    setSending(true);
    const { error } = await supabase
      .from('support_messages')
      .insert({ email, message, enquiry_type: enquiryType });

    setSending(false);

    if (!error) {
      setSuccess(true);
      setMessage('');
      fetchMessages();
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('support_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 mb-3">
            Get Support
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We're here to help you with any questions or issues you may have. Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <MessageSquare className="mr-3 text-blue-500" />
              Send us a Message
            </h2>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Email</label>
              <input
                ref={emailRef}
                type="email"
                id="email"
                placeholder="you@example.com"
                className={`w-full border px-4 py-2 rounded-md transition bg-gray-50 dark:bg-gray-700 dark:text-white ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="enquiryType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type of Enquiry</label>
              <Select onValueChange={setEnquiryType} defaultValue={enquiryType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an enquiry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  <SelectItem value="Technical Support">Technical Support</SelectItem>
                  <SelectItem value="Billing Question">Billing Question</SelectItem>
                  <SelectItem value="Feature Request">Feature Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Message</label>
              <textarea
                ref={messageRef}
                id="message"
                placeholder="How can we help you today?"
                className={`w-full min-h-[140px] resize-y px-4 py-2 rounded-md transition bg-gray-50 dark:bg-gray-700 dark:text-white ${
                  errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setErrors((prev) => ({ ...prev, message: undefined }));
                }}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleSend}
                disabled={sending}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {sending ? <Loader2 className="animate-spin w-5 h-5" /> : <Send size={18} />}
                {sending ? 'Sending...' : 'Send Message'}
              </button>

              {success && (
                <p className="text-green-600 text-sm font-medium animate-pulse">Message sent successfully!</p>
              )}
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center mb-4">
                <HelpCircle className="mr-3 text-blue-500" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200">What is InvoiceMyte?</h3>
                  <p className="text-gray-600 dark:text-gray-400">InvoiceMyte is a free invoicing tool for freelancers and small businesses.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200">How do I create an invoice?</h3>
                  <p className="text-gray-600 dark:text-gray-400">Simply log in to your dashboard and click on the 'New Invoice' button to start.</p>
                </div>
                 <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200">Can I customize my invoices?</h3>
                  <p className="text-gray-600 dark:text-gray-400">Yes, you can add your logo and company details in the settings page.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-8">
               <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center mb-4">
                <Mail className="mr-3 text-blue-500" />
                Direct Contact
              </h2>
              <p className="text-gray-600 dark:text-gray-400">For urgent matters, you can email us directly at <a href="mailto:support@invoicemyte.com" className="text-blue-500 hover:underline">support@invoicemyte.com</a></p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
