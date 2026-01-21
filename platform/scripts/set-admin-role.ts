/**
 * Script to set admin role for kunal@growthmodo.com
 * 
 * This script can be run using:
 * npx tsx scripts/set-admin-role.ts
 * 
 * Or you can use the SQL script: supabase-update-admin-role.sql
 * Run it directly in Supabase SQL Editor
 */

import { updateUserRoleByEmail } from '@/actions/admin'

async function main() {
  const email = 'kunal@growthmodo.com'
  const role = 'ADMIN'
  
  console.log(`Updating ${email} to ${role}...`)
  
  const result = await updateUserRoleByEmail(email, role)
  
  if (result.error) {
    console.error('Error:', result.error)
    process.exit(1)
  }
  
  console.log('Success:', result.message)
  console.log('Updated user:', result.data)
}

main().catch(console.error)
