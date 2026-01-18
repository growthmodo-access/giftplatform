import { getCurrentUserProfile } from '@/actions/profile'
import { ProfileForm } from '@/components/settings/profile-form'
import { CompanyForm } from '@/components/settings/company-form'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const profileData = await getCurrentUserProfile()

  if (profileData.error) {
    redirect('/login')
  }

  const { user, company } = profileData
  const canEditCompany = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileForm 
          initialName={user.name}
          initialEmail={user.email}
        />
        
        <CompanyForm
          initialName={company?.name || null}
          initialDomain={company?.domain || null}
          initialBudget={company?.budget || null}
          canEdit={canEditCompany}
        />
      </div>
    </div>
  )
}
