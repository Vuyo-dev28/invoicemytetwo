
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, Annoyed } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const plans = {
  monthly: [
    {
      name: 'Free',
      price: '0',
      description: 'Explore and experience.',
      tagline: 'Dive into the possibilities.',
      buttonText: 'Current',
      isCurrent: true,
      features: ['Up to 3 free', 'Up to 2 free', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Beta access'],
    },
    {
      name: 'Starter',
      price: '9.99',
      description: 'Start small, dream big.',
      tagline: 'Unleash your potential.',
      buttonText: 'Upgrade',
      mostValued: true,
      features: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Beta access'],
    },
    {
      name: 'Professional',
      price: '52.00',
      description: 'Seize infinite growth.',
      tagline: 'Elevate your journey.',
      buttonText: 'Upgrade',
      features: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Beta access'],
    },
  ],
  yearly: [
    {
      name: 'Free',
      price: '0',
      description: 'Explore and experience.',
      tagline: 'Dive into the possibilities.',
      buttonText: 'Current',
      isCurrent: true,
       features: ['Up to 3 free', 'Up to 2 free', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Beta access'],
    },
    {
      name: 'Starter',
      price: '7.60',
      originalPrice: '9.99',
      discount: '24',
      description: 'Start small, dream big.',
      tagline: 'Unleash your potential.',
      buttonText: 'Upgrade',
      mostValued: true,
       features: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Beta access'],
    },
    {
      name: 'Professional',
      price: '39.00',
      originalPrice: '52.00',
      discount: '25',
      description: 'Seize infinite growth.',
      tagline: 'Elevate your journey.',
      buttonText: 'Upgrade',
      features: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Beta access'],
    },
  ],
};

const featureNames = ['Invoice', 'Proposals', 'eSign', 'Estimate', 'Credit note', 'Delivery note', 'Purchase order', 'Custom documents', 'Create website'];
const addOnFeatures = ['Custom fonts and colors', 'Custom domain', 'Multi page', 'Remove Bookipi branding'];

const addOn = {
    monthly: {
        price: '13.00',
    },
    yearly: {
        price: '9.99',
        originalPrice: '13.00',
        discount: '23'
    }
}

export default function SubscriptionPage() {
  const [isYearly, setIsYearly] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useState(() => {
    const fetchUser = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserEmail(user.email || '');
        } else {
            router.push('/login');
        }
    }
    fetchUser();
  });
  
  const handleSuccess = (reference: any) => {
    console.log(reference);
    // Here you would typically call a server action to verify the transaction
    // and update the user's subscription status in your database.
    toast({
        title: "Payment Successful",
        description: "Your subscription has been updated.",
    });
  };

  const handleClose = () => {
    toast({
        title: "Payment Closed",
        description: "The payment popup was closed.",
        variant: 'destructive'
    });
  };
  
  const PaystackButton = ({ planName, amount }: { planName: string; amount: number }) => {
     const initializePayment = usePaystackPayment({
        reference: (new Date()).getTime().toString(),
        email: userEmail,
        amount: amount * 100, // Paystack amount is in kobo
        publicKey: 'pk_test_53ea257a8d594133643d86ff00277f6b5ff86d7f',
        metadata: {
            plan: planName,
            billing_cycle: isYearly ? 'yearly' : 'monthly'
        }
     });

     return (
        <Button onClick={() => initializePayment(handleSuccess, handleClose)} className="w-full">
            Upgrade
        </Button>
     );
  }


  const currentPlans = isYearly ? plans.yearly : plans.monthly;
  const currentAddOn = isYearly ? addOn.yearly : addOn.monthly;

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Select a plan</h1>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Label htmlFor="billing-cycle">Monthly</Label>
          <Switch id="billing-cycle" checked={isYearly} onCheckedChange={setIsYearly} />
          <Label htmlFor="billing-cycle">Yearly discount</Label>
          {isYearly && <span className="text-primary font-semibold">You've saved 25%!</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {currentPlans.map((plan, index) => (
          <Card key={index} className={`flex flex-col ${plan.mostValued ? 'border-primary border-2' : ''}`}>
            {plan.mostValued && <div className="bg-primary text-primary-foreground text-center text-sm font-semibold py-1 rounded-t-md">Most value</div>}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{plan.tagline}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">${plan.price}</span>
                {plan.originalPrice && <span className="text-muted-foreground line-through">${plan.originalPrice}</span>}
              </div>
              {plan.discount && <p className="text-sm text-green-600 font-semibold">Save {plan.discount}%</p>}
              <p className="text-xs text-muted-foreground mt-1">Per month, billed {isYearly ? 'yearly' : 'monthly'}</p>
            </CardContent>
            <CardFooter>
                {plan.isCurrent ? (
                     <Button variant="outline" disabled className="w-full">Current</Button>
                ) : (
                    <PaystackButton planName={plan.name} amount={parseFloat(plan.price) * (isYearly ? 12 : 1)} />
                )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div>
        <Table>
          <thead>
            <tr>
              <th className="text-left py-4"></th>
              {currentPlans.map(plan => <th key={plan.name} className="text-center font-bold py-4">{plan.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {featureNames.map((featureName, featureIndex) => (
              <tr key={featureName} className="border-b">
                <td className="py-3 font-medium">{featureName}</td>
                {currentPlans.map(plan => (
                  <td key={plan.name} className="text-center py-3">
                    {plan.features[featureIndex] === 'Unlimited' ? <Check className="mx-auto text-primary" /> : plan.features[featureIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-2">Add-ons</h2>
        <Card className="flex flex-col md:flex-row items-center justify-between p-6">
            <div className="flex-1 mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md">NEW</span>
                    <h3 className="text-lg font-semibold">AI Website Builder Pro</h3>
                </div>
                <p className="text-muted-foreground mb-4">Professional tools to empower your website</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {addOnFeatures.map(f => <div key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{f}</div>)}
                </div>
            </div>
            <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                 <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${currentAddOn.price}</span>
                    {currentAddOn.originalPrice && <span className="text-muted-foreground line-through">${currentAddOn.originalPrice}</span>}
                 </div>
                 {currentAddOn.discount && <p className="text-sm text-green-600 font-semibold">Save {currentAddOn.discount}%</p>}
                 <p className="text-xs text-muted-foreground mt-1 mb-4">Per month, billed {isYearly ? 'yearly' : 'monthly'}</p>
                 <PaystackButton planName="AI Website Builder Pro" amount={parseFloat(currentAddOn.price) * (isYearly ? 12 : 1)} />
            </div>
        </Card>
      </div>
      
       <div className="text-center text-muted-foreground text-sm mt-8">
            <p>Automatically renews. Subscription is per company. Cancel anytime.</p>
        </div>
    </div>
  );
}

// Dummy table component for styling
const Table = ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <table className="w-full text-left" {...props}>{children}</table>
)

