/**
 * Parse campaign recipients CSV (name, email, designation, department, phone).
 * Safe to use on client and server.
 */

export type CsvRecipientRow = {
  name: string
  email: string
  designation?: string
  department?: string
  phone?: string
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      inQuotes = !inQuotes
    } else if ((c === ',' && !inQuotes) || c === '\n') {
      result.push(current)
      current = ''
    } else {
      current += c
    }
  }
  result.push(current)
  return result
}

/**
 * Parse CSV text with expected columns: name, email, designation, department, phone
 */
export function parseRecipientsCsv(csvText: string): { rows: CsvRecipientRow[]; error?: string } {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) {
    return { rows: [], error: 'CSV must have a header row and at least one data row' }
  }
  const header = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const nameIdx = header.findIndex(h => h === 'name')
  const emailIdx = header.findIndex(h => h === 'email')
  if (nameIdx === -1 || emailIdx === -1) {
    return { rows: [], error: 'CSV must include "name" and "email" columns' }
  }
  const designationIdx = header.findIndex(h => h === 'designation')
  const departmentIdx = header.findIndex(h => h === 'department')
  const phoneIdx = header.findIndex(h => h === 'phone')

  const rows: CsvRecipientRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    const name = (values[nameIdx] || '').trim()
    const email = (values[emailIdx] || '').trim()
    if (!email) continue
    rows.push({
      name: name || email,
      email,
      designation: designationIdx >= 0 ? (values[designationIdx] || '').trim() || undefined : undefined,
      department: departmentIdx >= 0 ? (values[departmentIdx] || '').trim() || undefined : undefined,
      phone: phoneIdx >= 0 ? (values[phoneIdx] || '').trim() || undefined : undefined,
    })
  }
  return { rows }
}
