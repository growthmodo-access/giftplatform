import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAuditLog } from '@/actions/audit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollText } from 'lucide-react'
import { format } from 'date-fns'

export default async function AuditPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (currentUser?.role !== 'SUPER_ADMIN') redirect('/dashboard')

  const { data: entries, error } = await getAuditLog()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <ScrollText className="w-8 h-8" />
          Audit log
        </h1>
        <p className="text-muted-foreground mt-1">
          Recent actions: campaign create, order create, vendor assign. Only SUPER_ADMIN can view.
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Last 100 events</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}
          {!entries?.length ? (
            <p className="text-muted-foreground py-6">No audit entries yet.</p>
          ) : (
            <ul className="divide-y divide-border/50">
              {entries.map((e) => (
                <li key={e.id} className="py-3 first:pt-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-medium text-foreground">{e.action}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(e.created_at), 'PPp')}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {e.resource_type} {e.resource_id && `· ${e.resource_id.slice(0, 8)}…`}
                    {e.user_email && ` · ${e.user_email}`}
                    {e.details && typeof e.details === 'object' && Object.keys(e.details).length > 0 && (
                      <span className="ml-2">· {JSON.stringify(e.details)}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
