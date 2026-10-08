import { Routes } from '@angular/router';

const buildingList = () =>
  import('./views/building-list/building-list').then((m) => m.BuildingList);
const buildingForm = () =>
  import('./views/building-form/building-form').then((m) => m.BuildingForm);
const equipmentList = () =>
  import('./views/equipment-list/equipment-list').then((m) => m.EquipmentList);
const equipmentForm = () =>
  import('./views/equipment-form/equipment-form').then((m) => m.EquipmentForm);
const alertList = () => import('./views/alert-list/alert-list').then((m) => m.AlertList);
const sensorList = () => import('./views/sensor-list/sensor-list').then((m) => m.SensorList);
const sensorAssignForm = () =>
  import('./views/sensor-assign-form/sensor-assign-form').then((m) => m.SensorAssignForm);
const readingHistory = () =>
  import('./views/reading-history/reading-history').then((m) => m.ReadingHistory);

/**
 * Routes of the Asset Monitoring bounded context.
 */
export const assetMonitoringRoutes: Routes = [
  { path: 'buildings', loadComponent: buildingList },
  { path: 'buildings/new', loadComponent: buildingForm },
  { path: 'buildings/:id/edit', loadComponent: buildingForm },
  { path: 'equipment', loadComponent: equipmentList },
  { path: 'equipment/new', loadComponent: equipmentForm },
  { path: 'equipment/:id/edit', loadComponent: equipmentForm },
  { path: 'alerts', loadComponent: alertList },
  { path: 'sensors', loadComponent: sensorList },
  { path: 'sensors/:id/assign', loadComponent: sensorAssignForm },
  { path: 'readings', loadComponent: readingHistory },
];
