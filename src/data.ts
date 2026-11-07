import type { Application, ApplicationDraft } from './types'

export const STORAGE_KEY = 'job-tracker-applications-v1'

export const emptyDraft = (): ApplicationDraft => ({
  company: '', role: '', url: '', location: '', workMode: 'Unknown',
  dateSaved: new Date().toISOString().slice(0, 10), dateApplied: '', status: 'Saved',
  contactName: '', contactEmail: '', followUpDate: '', salaryMin: '', salaryMax: '', notes: '', tags: '',
})

export function validateDraft(draft: ApplicationDraft): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!draft.company.trim()) errors.company = 'Company name is required.'
  if (!draft.role.trim()) errors.role = 'Role title is required.'
  if (!draft.dateSaved) errors.dateSaved = 'Date saved is required.'
  if (draft.dateSaved && !/^\d{4}-\d{2}-\d{2}$/.test(draft.dateSaved)) errors.dateSaved = 'Enter a valid saved date.'
  if (draft.status !== 'Saved' && !draft.dateApplied) errors.dateApplied = 'Date applied is required once the status leaves Saved.'
  if (draft.dateApplied && draft.dateSaved && draft.dateApplied < draft.dateSaved) errors.dateApplied = 'Date applied cannot be before date saved.'
  if (draft.dateSaved && new Date(`${draft.dateSaved}T00:00:00`) > new Date()) errors.dateSaved = 'Date saved cannot be in the future.'
  if (draft.followUpDate && draft.dateApplied && draft.followUpDate < draft.dateApplied) errors.followUpDate = 'Follow-up cannot be before the application date.'
  if (draft.contactEmail && !/^\S+@\S+\.\S+$/.test(draft.contactEmail)) errors.contactEmail = 'Enter a valid email address.'
  if (draft.salaryMin && draft.salaryMax && Number(draft.salaryMin) > Number(draft.salaryMax)) errors.salaryMax = 'Maximum salary must be greater than minimum salary.'
  return errors
}

export function draftToApplication(draft: ApplicationDraft, existing?: Application): Application {
  const now = new Date().toISOString().slice(0, 10)
  const history = existing?.statusHistory ? [...existing.statusHistory] : [{ status: draft.status, date: draft.dateApplied || draft.dateSaved || now }]
  if (existing && existing.status !== draft.status) history.push({ status: draft.status, date: now })
  return {
    id: existing?.id ?? crypto.randomUUID(), company: draft.company.trim(), role: draft.role.trim(), url: draft.url.trim(),
    location: draft.location.trim(), workMode: draft.workMode, dateSaved: draft.dateSaved, dateApplied: draft.dateApplied,
    status: draft.status, contactName: draft.contactName.trim(), contactEmail: draft.contactEmail.trim(), followUpDate: draft.followUpDate,
    salaryMin: draft.salaryMin, salaryMax: draft.salaryMax, notes: draft.notes.trim(),
    tags: [...new Set(draft.tags.split(',').map(t => t.trim()).filter(Boolean))], statusHistory: history,
    isSample: existing?.isSample ?? false,
  }
}

export function applicationToDraft(app: Application): ApplicationDraft {
  return { company: app.company, role: app.role, url: app.url, location: app.location, workMode: app.workMode,
    dateSaved: app.dateSaved, dateApplied: app.dateApplied, status: app.status, contactName: app.contactName,
    contactEmail: app.contactEmail, followUpDate: app.followUpDate, salaryMin: app.salaryMin, salaryMax: app.salaryMax,
    notes: app.notes, tags: app.tags.join(', ') }
}

function addDays(base: Date, days: number) {
  const value = new Date(base)
  value.setDate(value.getDate() + days)
  return value.toISOString().slice(0, 10)
}

export function createSampleData(): Application[] {
  const today = new Date()
  return [
    { id: crypto.randomUUID(), company: 'Northstar Labs', role: 'Senior Product Designer', url: 'https://example.com/northstar', location: 'Seattle, WA', workMode: 'Hybrid', dateSaved: addDays(today, -38), dateApplied: addDays(today, -35), status: 'Interviewing', contactName: 'Maya Chen', contactEmail: 'maya@example.com', followUpDate: addDays(today, 2), salaryMin: '135000', salaryMax: '155000', notes: 'Portfolio review completed. Prepare examples for the team interview.', tags: ['Design systems', 'SaaS'], statusHistory: [{ status: 'Applied', date: addDays(today, -35) }, { status: 'Interviewing', date: addDays(today, -18) }], isSample: true },
    { id: crypto.randomUUID(), company: 'Brightside Health', role: 'Product Designer II', url: 'https://example.com/brightside', location: 'Remote', workMode: 'Remote', dateSaved: addDays(today, -29), dateApplied: addDays(today, -27), status: 'Offer', contactName: 'Jon Bell', contactEmail: 'jon@example.com', followUpDate: addDays(today, -1), salaryMin: '125000', salaryMax: '145000', notes: 'Offer received. Reviewing benefits before decision.', tags: ['Healthcare', 'Remote'], statusHistory: [{ status: 'Applied', date: addDays(today, -27) }, { status: 'Interviewing', date: addDays(today, -12) }, { status: 'Offer', date: addDays(today, -3) }], isSample: true },
    { id: crypto.randomUUID(), company: 'Atlas Works', role: 'UX Designer', url: 'https://example.com/atlas', location: 'Austin, TX', workMode: 'On-site', dateSaved: addDays(today, -21), dateApplied: addDays(today, -20), status: 'Applied', contactName: '', contactEmail: '', followUpDate: addDays(today, 5), salaryMin: '105000', salaryMax: '125000', notes: 'Referral from former teammate.', tags: ['Fintech', 'Referral'], statusHistory: [{ status: 'Applied', date: addDays(today, -20) }], isSample: true },
    { id: crypto.randomUUID(), company: 'Fieldstone', role: 'Staff Experience Designer', url: '', location: 'New York, NY', workMode: 'Hybrid', dateSaved: addDays(today, -14), dateApplied: '', status: 'Saved', contactName: '', contactEmail: '', followUpDate: addDays(today, 3), salaryMin: '', salaryMax: '', notes: 'Review the portfolio requirements before applying.', tags: ['Enterprise'], statusHistory: [{ status: 'Saved', date: addDays(today, -14) }], isSample: true },
    { id: crypto.randomUUID(), company: 'Cedar & Co.', role: 'Interaction Designer', url: 'https://example.com/cedar', location: 'Boston, MA', workMode: 'Hybrid', dateSaved: addDays(today, -44), dateApplied: addDays(today, -40), status: 'Rejected', contactName: 'Lena Ortiz', contactEmail: '', followUpDate: '', salaryMin: '118000', salaryMax: '138000', notes: 'No feedback after the final round.', tags: ['Consumer'], statusHistory: [{ status: 'Applied', date: addDays(today, -40) }, { status: 'Interviewing', date: addDays(today, -25) }, { status: 'Rejected', date: addDays(today, -8) }], isSample: true },
  ]
}

export function filterApplications(apps: Application[], query: string, status: string, tag: string) {
  const normalized = query.trim().toLowerCase()
  return apps.filter(app => {
    const matchesQuery = !normalized || [app.company, app.role, app.location, ...app.tags].join(' ').toLowerCase().includes(normalized)
    const matchesStatus = status === 'All' || app.status === status
    const matchesTag = tag === 'All' || app.tags.includes(tag)
    return matchesQuery && matchesStatus && matchesTag
  })
}
