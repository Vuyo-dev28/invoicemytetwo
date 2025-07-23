'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Send } from 'lucide-react';

export default function SupportPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
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
      .insert({ email, message });

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
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 mb-2">
        Support
      </h1>
      <p className="text-gray-600 mb-6">Have a question or need help? Drop us a message!</p>

      <div className="bg-white border shadow-lg rounded-xl p-6 space-y-4 mb-10">
        <div>
          <input
            ref={emailRef}
            type="email"
            placeholder="Your email"
            className={`w-full border px-4 py-2 rounded-md transition ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
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
          <textarea
            ref={messageRef}
            placeholder="Your message..."
            className={`w-full min-h-[120px] resize-none px-4 py-2 rounded-md transition ${
              errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
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
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition"
          >
            {sending ? <Loader2 className="animate-spin w-4 h-4" /> : <Send size={16} />}
            {sending ? 'Sending...' : 'Send Message'}
          </button>

          {success && (
            <p className="text-green-600 text-sm font-medium">Message sent!</p>
          )}
        </div>
      </div>
    </div>
  );
}
