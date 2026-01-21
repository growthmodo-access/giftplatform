import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function CheckRolePage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: currentUser, error } = await supabase
    .from('users')
    .select('id, email, name, role, company_id')
    .eq('id', user.id)
    .maybeSingle()

  if (error || !currentUser) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Could not fetch user data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error?.message || 'User not found'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Your Role Information</CardTitle>
          <CardDescription>Current role from database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
            <p className="text-base">{currentUser.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
            <p className="text-base">{currentUser.name || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Role (Raw from Database)</p>
            <p className="text-base font-mono bg-muted p-2 rounded">
              {JSON.stringify(currentUser.role)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Type: {typeof currentUser.role} | 
              Is Null: {String(currentUser.role === null)} | 
              Is Undefined: {String(currentUser.role === undefined)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Company ID</p>
            <p className="text-base font-mono text-sm">{currentUser.company_id || 'Not set'}</p>
          </div>
          
          {currentUser.role !== 'SUPER_ADMIN' && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Role is not SUPER_ADMIN
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">
                To update your role to SUPER_ADMIN, run this SQL in Supabase SQL Editor:
              </p>
              <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
{`UPDATE public.users
SET 
  role = 'SUPER_ADMIN',
  updated_at = NOW()
WHERE email = '${currentUser.email}';

-- Verify
SELECT id, email, name, role
FROM public.users
WHERE email = '${currentUser.email}';`}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
