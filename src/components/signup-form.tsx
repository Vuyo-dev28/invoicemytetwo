
"use client";

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { FileText } from 'lucide-react';

const step1Schema = z.object({
    company_name: z.string().min(1, 'Company name is required'),
});

const step2Schema = z.object({
    business_type: z.string().min(1, 'Business type is required'),
    currency: z.string().min(1, 'Currency is required'),
});

const step3Schema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().optional(),
});

const step4Schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const formSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);

type SignupFormValues = z.infer<typeof formSchema>;

const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'LLC',
    'Corporation',
    'Non-profit',
    'Other'
];

export function SignupForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const supabase = createClientComponentClient();
    const router = useRouter();
    const { toast } = useToast();

    const methods = useForm<SignupFormValues>({
        resolver: zodResolver(
            step === 1 ? step1Schema :
            step === 2 ? step2Schema :
            step === 3 ? step3Schema :
            step4Schema
        ),
        defaultValues: {
            company_name: '',
            business_type: '',
            currency: 'USD',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
        },
    });

    const { control, handleSubmit, trigger } = methods;

    const nextStep = async () => {
        const isValid = await trigger();
        if (isValid) {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => setStep((prev) => prev - 1);

    const onSubmit = async (data: SignupFormValues) => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    company_name: data.company_name,
                    business_type: data.business_type,
                    currency: data.currency,
                    first_name: data.first_name,
                    last_name: data.last_name,
                },
            },
        });

        if (error) {
            toast({
                title: 'Error signing up',
                description: error.message === "User already registered" 
                    ? "This email address is already in use. Please use a different email or log in." 
                    : error.message,
                variant: 'destructive',
            });
            setLoading(false);
        } else {
            // Also sign in the user
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (signInError) {
                toast({
                    title: 'Error signing in after signup',
                    description: signInError.message,
                    variant: 'destructive',
                });
                router.push('/login');
            } else {
                toast({
                    title: 'Welcome!',
                    description: 'Your account has been created successfully.',
                });
                router.push('/');
                router.refresh();
            }
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader className="items-center">
                 <div className="flex items-center gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-semibold">Invoice Ease</span>
                </div>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    {step === 1 && "Tell us about your company."}
                    {step === 2 && "Tell us just a little bit more!"}
                    {step === 3 && "What should we call you?"}
                    {step === 4 && "Finally, what's your email?"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Progress value={(step / 4) * 100} className="mb-6" />
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {step === 1 && (
                            <FormField
                                control={control}
                                name="company_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Please enter your company name here." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {step === 2 && (
                            <>
                                <FormField
                                    control={control}
                                    name="business_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Business Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select business type..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {businessTypes.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="currency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Currency Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select currency..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="USD">USD - United States Dollar</SelectItem>
                                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                                    <SelectItem value="GBP">GBP - British Pound Sterling</SelectItem>
                                                    <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                                                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <FormField
                                    control={control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your first name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your last name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        
                        {step === 4 && (
                            <>
                                <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Enter your email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Enter your password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        <div className="flex justify-between">
                            {step > 1 && (
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    Previous
                                </Button>
                            )}
                            {step < 4 && (
                                <Button type="button" onClick={nextStep} className="ml-auto">
                                    Next
                                </Button>
                            )}
                            {step === 4 && (
                                <Button type="submit" disabled={loading} className="ml-auto">
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            )}
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
            <CardFooter className="justify-center">
                 <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                        Log in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
