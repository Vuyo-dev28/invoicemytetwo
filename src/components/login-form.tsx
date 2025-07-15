
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card"
import Link from "next/link"
import { FileText } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

type UserFormValue = z.infer<typeof formSchema>

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const supabase = createClientComponentClient()

  const defaultValues = {
    email: "",
    password: "",
  }
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      setLoading(false)
    } else {
        router.push('/');
        router.refresh();
    }
  }

  return (
    <Card>
        <CardHeader className="items-center">
            <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-primary" />
                <span className="text-2xl font-semibold">Invoice Ease</span>
            </div>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
                >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input
                            type="email"
                            placeholder="Enter your email..."
                            disabled={loading}
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input
                            type="password"
                            placeholder="Enter your password..."
                            disabled={loading}
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <Button disabled={loading} className="w-full" type="submit">
                    {loading ? "Signing in..." : "Sign In"}
                </Button>
                </form>
            </Form>
        </CardContent>
        <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                </Link>
            </p>
        </CardFooter>
    </Card>
  )
}
