import Link from 'next/link';

export default function AuthConfirmed() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="max-w-md w-full text-center p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-primary mb-4">Email Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for confirming your email address. You can now sign in to your account.
        </p>
        <Link href="/login">
          <a className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-semibold transition-colors">
            Go to Sign In
          </a>
        </Link>
      </div>
    </div>
  );
}
