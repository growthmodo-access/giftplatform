import { getCurrentUserProfile } from '@/actions/profile'
import { getSwagStoreSettings } from '@/actions/swag-store'
import { ProfileForm } from '@/components/settings/profile-form'
import { CompanyForm } from '@/components/settings/company-form'
import { AppSettings } from '@/components/settings/app-settings'
import { SwagStoreSettings } from '@/components/settings/swag-store-settings'
import { redirect } from 'next/navigation'
import { isCompanyHRDb, toAppRole } from '@/lib/roles'

export default async function SettingsPage() {
  const profileData = await getCurrentUserProfile()
  if (profileData.error) redirect('/login')

  const { user, company } = profileData
  const canEditCompany = user.role === 'SUPER_ADMIN' || isCompanyHRDb(user.role)
  const isSuperAdmin = user.role === 'SUPER_ADMIN'

  // Get swag store settings if company exists
  let swagStoreSettings = null
  if (company?.id) {
    const swagData = await getSwagStoreSettings(company.id)
    swagStoreSettings = swagData.data
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account, company, and app preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileForm 
          initialName={user.name}
          initialEmail={user.email}
        />
        
        <CompanyForm
          initialName={company?.name || null}
          initialDomain={company?.domain || null}
          initialBudget={company?.budget ?? null}
          initialCurrency={(company as { currency?: string } | null)?.currency || null}
          canEdit={canEditCompany}
        />
      </div>

      {/* Swag Store Settings */}
      {canEditCompany && company?.id && (
        <SwagStoreSettings
          companyId={company.id}
          storeIdentifier={swagStoreSettings?.storeIdentifier || null}
          isEnabled={swagStoreSettings?.isEnabled || false}
          canEdit={canEditCompany}
        />
      )}

      {/* App-Wide Settings (Super Admin only) */}
      {isSuperAdmin && (
        <AppSettings currentUserRole="SUPER_ADMIN" />
      )}
    </div>
  )
}
