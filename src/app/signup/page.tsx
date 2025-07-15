
"use client";
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signup } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

const signupSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  business_type: z.string().min(1, 'Business type is required'),
  currency: z.string().min(1, 'Currency is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const steps = [
    { id: 1, title: "Tell us about your company.", fields: ['company_name'] },
    { id: 2, title: "Tell us just a little bit more!", fields: ['business_type', 'currency'] },
    { id: 3, title: "What should we call you?", fields: ['first_name', 'last_name'] },
    { id: 4, title: "Finally, what's your email?", fields: ['email', 'password'] },
];

function MultiStepSignup({ searchParams }: { searchParams: { message: string } }) {
    const [currentStep, setCurrentStep] = useState(0);
    const methods = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            company_name: '',
            business_type: '',
            currency: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
        },
    });

    const { register, handleSubmit, trigger, formState: { errors } } = methods;

    const nextStep = async () => {
        const fields = steps[currentStep].fields;
        const output = await trigger(fields as any, { shouldFocus: true });
        if (!output) return;

        if (currentStep < steps.length - 1) {
            setCurrentStep(step => step + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(step => step - 1);
        }
    };
    
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <Progress value={progress} className="mb-4" />
                <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                <CardDescription>
                    {currentStep === 0 && "Please enter your company name here."}
                    {currentStep === 1 && "Enter your business type and your preferred currency."}
                    {currentStep === 2 && "Please enter your name below."}
                    {currentStep === 3 && "Enter your preferred email address for contact and password."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormProvider {...methods}>
                    <form action={signup} onSubmit={handleSubmit((data) => {
                        const formData = new FormData();
                        Object.entries(data).forEach(([key, value]) => {
                            formData.append(key, value as string);
                        });
                        signup(formData);
                    })}>
                        <div className="grid gap-4">
                            {currentStep === 0 && (
                                <div className="grid gap-2">
                                    <Label htmlFor="company_name">Company name</Label>
                                    <Input id="company_name" {...register('company_name')} placeholder="e.g. InvoiceMe Pty Ltd." />
                                    {errors.company_name && <p className="text-sm text-destructive">{errors.company_name.message}</p>}
                                </div>
                            )}

                            {currentStep === 1 && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="business_type">Business Type</Label>
                                        <Select onValueChange={(value) => methods.setValue('business_type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select business type..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sole-trader">Sole Trader</SelectItem>
                                                <SelectItem value="company">Company</SelectItem>
                                                <SelectItem value="freelancer">Freelancer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.business_type && <p className="text-sm text-destructive">{errors.business_type.message}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="currency">Currency Type</Label>
                                        <Select onValueChange={(value) => methods.setValue('currency', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select currency..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                                                <SelectItem value="USD">USD - US Dollar</SelectItem>
                                                <SelectItem value="EUR">EUR - Euro</SelectItem>
                                                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.currency && <p className="text-sm text-destructive">{errors.currency.message}</p>}
                                    </div>
                                </>
                            )}
                            
                            {currentStep === 2 && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_name">First Name</Label>
                                        <Input id="first_name" {...register('first_name')} />
                                        {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name">Last Name (Optional)</Label>
                                        <Input id="last_name" {...register('last_name')} />
                                    </div>
                                </>
                            )}

                             {currentStep === 3 && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" {...register('email')} placeholder="m@example.com" />
                                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" {...register('password')} />
                                        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                                    </div>
                                </>
                             )}
                            
                             {/* This is a hidden submit button that react-hook-form uses */}
                             <button type="submit" className="hidden" id="hidden-submit"></button>
                        </div>
                    </form>
                </FormProvider>
                {searchParams?.message && (
                    <div className="text-sm font-medium text-destructive text-center mt-4">
                        {searchParams.message}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <div className="w-full flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                        Back
                    </Button>
                    {currentStep < steps.length - 1 ? (
                        <Button type="button" onClick={nextStep}>
                            Next
                        </Button>
                    ) : (
                        <label htmlFor="hidden-submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
                            Create account
                        </label>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}

export default function SignupPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
        <div className="w-full max-w-lg flex flex-col items-center gap-6">
            <MultiStepSignup searchParams={searchParams} />
            <div className="text-sm text-center">
                <p>Already have an account?{' '}
                    <Link href="/login" className="underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    </div>
  )
}
