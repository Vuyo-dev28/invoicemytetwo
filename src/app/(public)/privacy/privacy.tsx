export default function privacy() {
  return (
    <div className="bg-background text-foreground max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Privacy Policy & Terms of Service</h1>

      {/* Privacy Policy Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Privacy Policy</h2>
        <p className="text-muted-foreground mb-6">
          Your privacy is important to us. This Privacy Policy explains how InvoiceMyte (“we,” “our,” or “us”)
          collects, uses, and protects your personal information when you use our services.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h3>
        <ul className="list-disc list-inside text-muted-foreground mb-4">
          <li><strong>Account Information:</strong> Email address, name, password when you register.</li>
          <li><strong>Billing Information:</strong> Payment details for subscriptions (processed by third-party providers).</li>
          <li><strong>Usage Data:</strong> How you interact with our platform (pages viewed, features used).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">2. How We Use Information</h3>
        <p className="text-muted-foreground mb-4">
          We use your data to:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4">
          <li>Provide and maintain our service</li>
          <li>Process payments and manage subscriptions</li>
          <li>Improve the user experience</li>
          <li>Send important updates or service-related emails</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. Data Security</h3>
        <p className="text-muted-foreground mb-4">
          We implement industry-standard security measures to protect your data, but no method is 100% secure.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. Third-Party Services</h3>
        <p className="text-muted-foreground mb-4">
          We use third-party providers for payments, analytics, and hosting. These providers may access your data
          only to perform tasks on our behalf.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">5. Contact Us</h3>
        <p className="text-muted-foreground">
          For any privacy concerns, contact us at <a href="mailto:invoicemyte@gmail.com" className="text-primary underline">invoicemyte@gmail.com</a>.
        </p>
      </section>

      {/* Terms of Service Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Terms of Service</h2>
        <p className="text-muted-foreground mb-6">
          By using InvoiceMyte, you agree to these Terms of Service. If you do not agree, you may not use our service.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. Account Responsibilities</h3>
        <p className="text-muted-foreground mb-4">
          You are responsible for maintaining the confidentiality of your account credentials and all activities
          under your account.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">2. Subscription & Billing</h3>
        <p className="text-muted-foreground mb-4">
          Paid plans are billed on a recurring basis unless canceled. No refunds are provided for partial billing
          periods.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. Acceptable Use</h3>
        <p className="text-muted-foreground mb-4">
          You agree not to use the service for any unlawful activities, spamming, or harmful behavior.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. Termination</h3>
        <p className="text-muted-foreground mb-4">
          We reserve the right to suspend or terminate your account for violations of these terms.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">5. Changes to Terms</h3>
        <p className="text-muted-foreground mb-4">
          We may update these terms at any time. Continued use of our service means you accept the changes.
        </p>

        <p className="text-muted-foreground mt-8">
          For any questions about these Terms, contact us at <a href="mailto:invoicemyte@gmail.com" className="text-primary underline">invoicemyte@gmail.com</a>.
        </p>
      </section>
    </div>
  );
}
