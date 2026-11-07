# Job Application Tracker with Insights

A responsive, local-first job application tracker built with React, TypeScript, and Vite.

## Features

- Add, edit, view, and delete applications with confirmation.
- Track company, role, posting URL, location, work mode, dates, status, contacts, salary, follow-ups, notes, and tags.
- Search and filter by status, tags, and date range; sort by application date, company, role, follow-up, or status.
- Update status directly and retain status changes in application history.
- Dashboard totals, status distribution, six-month application activity, follow-up reminders, and observed response/interview rates.
- Load labeled sample data and remove it with one click.
- Import and export CSV files with row-level validation.

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`.

Production checks:

```bash
npm test
npm run lint
npm run build
npm run preview
```

## Storage

Applications persist in browser `localStorage` under `job-tracker-applications-v1`. Data remains after refreshes and app restarts on the same browser and origin. It is not synchronized across browsers or devices; clearing browser storage removes it. Storage failures display an in-app warning.

## CSV format

Required columns are `company`, `role`, `dateSaved`, and `status`. Supported columns are:

```text
company,role,url,location,workMode,dateSaved,dateApplied,status,contactName,contactEmail,followUpDate,salaryMin,salaryMax,notes,tags
```

Valid status values are `Saved`, `Applied`, `Interviewing`, `Offer`, `Rejected`, and `Withdrawn`. Work mode values are `Remote`, `Hybrid`, `On-site`, or `Unknown`. Separate tags with commas. Imports merge valid rows into existing data, and invalid rows are reported with row numbers.

## Insight definitions

- Response rate: applications reaching `Interviewing`, `Offer`, or `Rejected`, divided by applications with a date applied.
- Interview rate: applications reaching `Interviewing`, `Offer`, or `Rejected`, divided by applied applications with an interview outcome or current `Applied` status.

Rates remain empty when the denominator is zero. They are descriptive, not predictive.

## Known limitations

- Data is browser-local and has no server, account system, or cross-device synchronization.
- CSV import merges valid rows; it does not replace existing data.
- Sample organizations and links are fictional and clearly marked in the app.
- The optional web font needs network access; local sans-serif fonts are used as fallback.
