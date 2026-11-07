import { STATUSES, type Application, type Status, type WorkMode } from './types'
import { validateDraft, applicationToDraft } from './data'

const headers = ['company','role','url','location','workMode','dateSaved','dateApplied','status','contactName','contactEmail','followUpDate','salaryMin','salaryMax','notes','tags']

function escapeCsv(value: string) { return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value }
export function exportApplicationsCsv(apps: Application[]) {
  const rows = apps.map(app => {
    const d = applicationToDraft(app)
    return headers.map(h => escapeCsv(String((d as unknown as Record<string,string>)[h] ?? ''))).join(',')
  })
  return [headers.join(','), ...rows].join('\n')
}

export function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const rows: string[][] = []; let row: string[] = []; let value = ''; let quoted = false
  for (let i=0;i<text.length;i++) {
    const c=text[i]
    if (c==='"') { if (quoted && text[i+1]==='"') { value+='"'; i++ } else quoted=!quoted }
    else if (c===',' && !quoted) { row.push(value); value='' }
    else if ((c==='\n'||c==='\r') && !quoted) { if (c==='\r'&&text[i+1]==='\n') i++; row.push(value); if (row.some(v=>v.trim())) rows.push(row); row=[]; value='' }
    else value+=c
  }
  row.push(value); if (row.some(v=>v.trim())) rows.push(row)
  if (!rows.length) return { headers: [], rows: [] }
  return { headers: rows[0].map(v=>v.trim()), rows: rows.slice(1) }
}

export function importApplicationsCsv(text: string): { applications: Application[]; errors: string[] } {
  const parsed=parseCsv(text); const errors:string[]=[]
  if (!parsed.headers.length) return { applications: [], errors:['The CSV file is empty.'] }
  const missing=['company','role','dateSaved','status'].filter(h=>!parsed.headers.includes(h))
  if (missing.length) errors.push(`Missing required columns: ${missing.join(', ')}`)
  if (errors.length) return { applications: [], errors }
  const applications:Application[]=[]
  parsed.rows.forEach((cells,index)=>{
    const record=Object.fromEntries(parsed.headers.map((h,i)=>[h,cells[i]?.trim()??'']))
    const draft={
      company:record.company||'', role:record.role||'', url:record.url||'', location:record.location||'',
      workMode:(['Remote','Hybrid','On-site','Unknown'].includes(record.workMode)?record.workMode:'Unknown') as WorkMode,
      dateSaved:record.dateSaved||'', dateApplied:record.dateApplied||'', status:(STATUSES.includes(record.status as Status)?record.status:'Saved') as Status,
      contactName:record.contactName||'', contactEmail:record.contactEmail||'', followUpDate:record.followUpDate||'',
      salaryMin:record.salaryMin||'', salaryMax:record.salaryMax||'', notes:record.notes||'', tags:record.tags||'',
    }
    const validation=validateDraft(draft)
    if (!record.status || !STATUSES.includes(record.status as Status)) validation.status='Status must be one of: Saved, Applied, Interviewing, Offer, Rejected, Withdrawn.'
    if (Object.keys(validation).length) errors.push(`Row ${index+2}: ${Object.values(validation).join(' ')}`)
    else applications.push({ ...draftToImport(draft), id:crypto.randomUUID(), isSample:false })
  })
  return { applications, errors }
}

function draftToImport(draft: ReturnType<typeof applicationToDraft>) {
  return {
    company:draft.company, role:draft.role, url:draft.url, location:draft.location, workMode:draft.workMode,
    dateSaved:draft.dateSaved, dateApplied:draft.dateApplied, status:draft.status, contactName:draft.contactName,
    contactEmail:draft.contactEmail, followUpDate:draft.followUpDate, salaryMin:draft.salaryMin, salaryMax:draft.salaryMax,
    notes:draft.notes, tags:[...new Set(draft.tags.split(',').map(t=>t.trim()).filter(Boolean))], statusHistory:[{status:draft.status,date:draft.dateApplied||draft.dateSaved}],
  }
}
