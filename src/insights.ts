import { STATUSES, type Application, type Status } from './types'

export function countByStatus(apps: Application[]) {
  return Object.fromEntries(STATUSES.map(status => [status, apps.filter(app => app.status === status).length])) as Record<Status, number>
}

export function applicationsOverTime(apps: Application[], months = 6) {
  const result: { label:string; count:number }[]=[]
  const now=new Date()
  for(let i=months-1;i>=0;i--) {
    const date=new Date(now.getFullYear(),now.getMonth()-i,1)
    const key=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`
    const label=date.toLocaleDateString(undefined,{month:'short'})
    result.push({label,count:apps.filter(app=>app.dateApplied && app.dateApplied.startsWith(key)).length})
  }
  return result
}

export function responseRate(apps: Application[]) {
  const withApplied=apps.filter(app=>app.dateApplied)
  if(withApplied.length===0) return null
  const denominator=withApplied.length
  const responderStatuses=new Set<Status>(['Interviewing','Offer','Rejected'])
  const numerator=withApplied.filter(app=>responderStatuses.has(app.status)).length
  return { value:Math.round(numerator/denominator*100), numerator, denominator }
}

export function interviewRate(apps: Application[]) {
  const withApplied=apps.filter(app=>app.dateApplied)
  const completedStatuses=new Set<Status>(['Interviewing','Offer','Rejected','Withdrawn'])
  const eligible=withApplied.filter(app=>completedStatuses.has(app.status) || app.status==='Applied')
  if(eligible.length===0) return null
  const numerator=eligible.filter(app=>app.status==='Interviewing'||app.status==='Offer'||app.status==='Rejected').length
  return { value:Math.round(numerator/eligible.length*100), numerator, denominator:eligible.length }
}
