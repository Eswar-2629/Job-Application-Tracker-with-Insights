import { describe, expect, it } from 'vitest'
import { exportApplicationsCsv, importApplicationsCsv } from './csv'
import type { Application } from './types'

const app:Application={id:'1',company:'Acme, Inc.',role:'Product Designer',url:'',location:'Remote',workMode:'Remote',dateSaved:'2026-01-01',dateApplied:'2026-01-02',status:'Applied',contactName:'',contactEmail:'',followUpDate:'',salaryMin:'100000',salaryMax:'120000',notes:'Quoted "note"',tags:['SaaS','Referral'],statusHistory:[]}

describe('CSV utilities',()=>{it('escapes commas and quotes and round-trips a valid row',()=>{const csv=exportApplicationsCsv([app]);expect(csv).toContain('"Acme, Inc."');const imported=importApplicationsCsv(csv);expect(imported.errors).toEqual([]);expect(imported.applications).toHaveLength(1);expect(imported.applications[0].company).toBe(app.company)});it('reports missing required columns',()=>{const result=importApplicationsCsv('company,role\nAcme,Designer');expect(result.applications).toEqual([]);expect(result.errors[0]).toContain('Missing required columns')});it('reports invalid status and row number',()=>{const csv='company,role,dateSaved,status\nAcme,Designer,2026-01-01,Unknown';const result=importApplicationsCsv(csv);expect(result.errors.join('')).toContain('Row 2')})})
