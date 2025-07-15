
import { signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function SignupPage({
    searchParams,
  }: {
    searchParams: { message: string }
  }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Sign Up</CardTitle>
                <CardDescription>
                Enter your information to create an account.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                 <form action={signup} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" name="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" name="password" required />
                    </div>
                     {searchParams?.message && (
                        <div className="text-sm font-medium text-destructive text-center">
                            {searchParams.message}
                        </div>
                    )}
                    <Button type="submit" className="w-full">
                        Create account
                    </Button>
                </form>
            </CardContent>
             <CardFooter className="text-sm text-center flex-col">
                <p>Already have an account?{' '}
                    <Link href="/login" className="underline">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    </div>
  )
}
