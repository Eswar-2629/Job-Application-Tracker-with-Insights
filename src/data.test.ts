import { describe, expect, it } from 'vitest'
import { filterApplications, validateDraft } from './data'
import type { Application, ApplicationDraft } from './types'

const draft: ApplicationDraft={company:'Acme',role:'Designer',url:'',location:'Remote',workMode:'Remote',dateSaved:'2026-01-01',dateApplied:'',status:'Saved',contactName:'',contactEmail:'',followUpDate:'',salaryMin:'',salaryMax:'',notes:'',tags:''}

describe('validation',()=>{it('requires company, role, and saved date',()=>{expect(validateDraft({...draft,company:'',role:''}).company).toBeTruthy();expect(validateDraft({...draft,company:'',role:''}).role).toBeTruthy()});it('requires applied date outside Saved',()=>{expect(validateDraft({...draft,status:'Applied'}).dateApplied).toBeTruthy()});it('rejects reversed salary range and invalid email',()=>{expect(validateDraft({...draft,salaryMin:'150000',salaryMax:'120000'}).salaryMax).toBeTruthy();expect(validateDraft({...draft,contactEmail:'bad'}).contactEmail).toBeTruthy()})})
describe('filtering',()=>{const apps:Application[]=[{id:'1',company:'Acme',role:'Designer',url:'',location:'Remote',workMode:'Remote',dateSaved:'2026-01-01',dateApplied:'2026-01-02',status:'Applied',contactName:'',contactEmail:'',followUpDate:'',salaryMin:'',salaryMax:'',notes:'',tags:['SaaS'],statusHistory:[]}];it('filters by query, status, and tag',()=>{expect(filterApplications(apps,'acme','Applied','SaaS')).toHaveLength(1);expect(filterApplications(apps,'other','Applied','SaaS')).toHaveLength(0);expect(filterApplications(apps,'','Rejected','SaaS')).toHaveLength(0)})})
