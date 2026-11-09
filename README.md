# Vigilia - Frontend Web Application

Web application of **Vigilia**, a platform by CodeNova that helps condominiums take care of their critical equipment: water pumps, electrical panels, elevators and air conditioning. IoT sensors watch the equipment, and Vigilia warns the team before a failure becomes an emergency.

- Live app: <https://vigilia-frontend.vercel.app>
- RESTful API it uses: <https://vigilia-api.onrender.com/swagger-ui/index.html>

## What you can do

- **Buildings:** list, register and edit buildings.
- **Critical equipment:** list them by building, register, edit and decommission them.
- **Sensors:** see which sensor watches each equipment, and its reading history.
- **Alerts:** see the active alerts sorted by severity, acknowledge them and resolve them.
- **Incidents:** residents report a problem, the administrator starts working on it and resolves it, and the resident rates the service.
- **Home:** a quick access card for administrators, residents and maintenance companies.
- The whole app works in English and Spanish.

## Technologies

- Angular 22 and Angular Material 22
- ngx-translate 18 for English and Spanish
- RxJS and Angular signals

## Run it on your computer

You need Node.js 24 LTS and npm.

```bash
npm install
npm start
```

Open <http://localhost:4200>. In development the app calls the API on `http://localhost:8080/api/v1`, so run the [backend](https://github.com/code-nova-1asi0729/backend) first.

If you do not have the backend running, you can use the fake API from Sprint 2 instead. Run `npm run fake-api` and change the URL in `src/environments/environment.development.ts` to `http://localhost:3000/api/v1`.

## Environments

| File | API |
|---|---|
| `src/environments/environment.development.ts` | Local API on `http://localhost:8080/api/v1` |
| `src/environments/environment.ts` | Deployed API on `https://vigilia-api.onrender.com/api/v1` |

The deployed API sleeps after 15 minutes without use. The first request after that can take about a minute.

## Project structure

We follow Domain-Driven Design. There is one folder per bounded context, and each one has four layers.

```text
src/app/
├── asset-monitoring/       Buildings, equipment, sensors, readings and alerts
├── incidents/              Incidents reported by residents
└── shared/                 Base classes, layout, language switcher and common views
    <context>/
    ├── domain/model/       Entities and enums with the business rules
    ├── application/        Store with signals
    ├── infrastructure/     API facade, endpoints, assemblers and resources
    └── presentation/       Routes and views
public/i18n/                en.json and es.json
server/                     Fake API from Sprint 2 (json-server)
```

## Deployment

Vercel publishes the app every time `main` changes. `vercel.json` sends every route to `index.html`, so links like `/incidents` work when you open them directly.

## Team

CodeNova, 1ASI0729 Open Source Application Development, UPC, 2026-20.

| Member | GitHub |
|---|---|
| Arturo Fernando Valladolid Jiménez | [@artuvall](https://github.com/artuvall) |
| Fernanda Ysabella Diaz Vargas | [@Fern9901](https://github.com/Fern9901) |
| Matthias Alonso Romero Veliz | [@AlonsoVelizUpc](https://github.com/AlonsoVelizUpc) |

## Contributing and license

Read [CONTRIBUTING.md](CONTRIBUTING.md) before you open a pull request. The changes of each version are in [CHANGELOG.md](CHANGELOG.md). This project uses the [MIT license](LICENSE.md).
