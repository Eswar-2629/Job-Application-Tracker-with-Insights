export const STATUSES = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'] as const
export type Status = typeof STATUSES[number]
export type WorkMode = 'Remote' | 'Hybrid' | 'On-site' | 'Unknown'

export interface StatusChange {
  status: Status
  date: string
}

export interface Application {
  id: string
  company: string
  role: string
  url: string
  location: string
  workMode: WorkMode
  dateSaved: string
  dateApplied: string
  status: Status
  contactName: string
  contactEmail: string
  followUpDate: string
  salaryMin: string
  salaryMax: string
  notes: string
  tags: string[]
  statusHistory: StatusChange[]
  isSample?: boolean
}

export interface ApplicationDraft {
  company: string
  role: string
  url: string
  location: string
  workMode: WorkMode
  dateSaved: string
  dateApplied: string
  status: Status
  contactName: string
  contactEmail: string
  followUpDate: string
  salaryMin: string
  salaryMax: string
  notes: string
  tags: string
}
