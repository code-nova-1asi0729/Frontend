import { Routes } from '@angular/router';

const incidentList = () =>
  import('./views/incident-list/incident-list').then((m) => m.IncidentList);
const incidentForm = () =>
  import('./views/incident-form/incident-form').then((m) => m.IncidentForm);
const incidentRatingForm = () =>
  import('./views/incident-rating-form/incident-rating-form').then((m) => m.IncidentRatingForm);

/**
 * Routes of the Incidents bounded context.
 */
export const incidentsRoutes: Routes = [
  { path: '', loadComponent: incidentList },
  { path: 'new', loadComponent: incidentForm },
  { path: ':id/rate', loadComponent: incidentRatingForm },
];
