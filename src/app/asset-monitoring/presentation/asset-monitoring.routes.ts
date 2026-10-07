import { Routes } from '@angular/router';

const buildingList = () =>
  import('./views/building-list/building-list').then((m) => m.BuildingList);
const buildingForm = () =>
  import('./views/building-form/building-form').then((m) => m.BuildingForm);

/**
 * Routes of the Asset Monitoring bounded context.
 */
export const assetMonitoringRoutes: Routes = [
  { path: 'buildings', loadComponent: buildingList },
  { path: 'buildings/new', loadComponent: buildingForm },
  { path: 'buildings/:id/edit', loadComponent: buildingForm },
];
