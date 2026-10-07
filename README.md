# Vigilia - Frontend Web Application

Angular application of **Vigilia**, the preventive maintenance platform for critical equipment
(water pumps, electrical panels, elevators and HVAC) in residential condominiums. Developed by CodeNova.

## Sprint 2 scope

- Buildings: list, register and edit (US07)
- Critical equipment: list by building, register, edit and decommission (US08, US09, US11)
- Sensors: list and assign to equipment (US10)
- Reading history by equipment and date range (US14)
- Active alerts sorted by severity and status changes (US19, US20)
- Incidents: report, follow up and rate (US23, US25, US27)
- English and spanish

## Technologies

- Angular 22
- Angular Material 22
- ngx-translate 18
- json-server 0.17.4 as fake API

## Prerequisites

- Node.js 24 LTS
- npm

## Run locally

```bash
npm install

# Terminal 1: fake API on http://localhost:3000/api/v1
npm run fake-api

# Terminal 2: application on http://localhost:4200
npm start

```

## Project structure

The code follows Domain-Driven Design. There is one folder per bounded context, and each one has four layers.

```text
src/app/
├── asset-monitoring/       Core: buildings, equipment, sensors, readings and alerts
├── incidents/              Core: incidents reported by residents
└── shared/                 Base classes, layout, i18n and common views
    <context>/
    ├── domain/model/       Entities and enums
    ├── application/        One store per bounded context (signals)
    ├── infrastructure/     API facade, endpoints, assemblers, resources
    └── presentation/       Routes and views
server/                     Fake API data (db.json), routes and sensor simulator
public/i18n/                en.json and es.json
```

## Environments

| File | API used |
|---|---|
| `src/environments/environment.development.ts` | json-server on `http://localhost:3000/api/v1` |
| `src/environments/environment.ts` | json-server deployed on Render (production build) |

## Deployment

- Application: Vercel (`vercel.json` redirects every route to `index.html`).
- Fake API: Render, Web Service with root directory `server` and start command `npm start`.
