
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Gift } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
            <Gift className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-2xl">InvoiceMe</CardTitle>
            <CardDescription>
            Enter your email and password to sign in or create an account.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form action={login} className="grid gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  />
              </div>
              <div className="grid gap-2">
                  <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" name="password" required />
              </div>
              <div className="flex gap-2">
                  <Button type="submit" className="w-full">
                      Login
                  </Button>
                  <Button formAction={signup} type="submit" className="w-full" variant="outline">
                      Sign Up
                  </Button>
              </div>
            </form>
        </CardContent>
        </Card>
    </div>
  )
}
