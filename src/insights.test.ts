import { describe, expect, it } from 'vitest'
import { countByStatus, interviewRate, responseRate } from './insights'
import type { Application } from './types'

function app(status:Application['status'], dateApplied='2026-01-01'):Application{return{id:status,company:'Acme',role:'Designer',url:'',location:'',workMode:'Unknown',dateSaved:'2025-12-01',dateApplied,status,contactName:'',contactEmail:'',followUpDate:'',salaryMin:'',salaryMax:'',notes:'',tags:['Test'],statusHistory:[]}}
describe('insight calculations',()=>{it('counts applications by status',()=>{expect(countByStatus([app('Applied'),app('Offer')]).Offer).toBe(1)});it('returns null when response denominator is empty',()=>{expect(responseRate([app('Saved','')])).toBeNull()});it('calculates observed response and interview rates',()=>{const apps=[app('Applied'),app('Interviewing'),app('Rejected')];expect(responseRate(apps)?.value).toBe(67);expect(interviewRate(apps)?.value).toBe(67)});it('does not predict an outcome for unapplied data',()=>{expect(interviewRate([app('Saved','')])).toBeNull()})})
