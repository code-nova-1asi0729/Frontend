import { Routes } from '@angular/router';

const buildingList = () =>
  import('./views/building-list/building-list').then((m) => m.BuildingList);
const buildingForm = () =>
  import('./views/building-form/building-form').then((m) => m.BuildingForm);
const deviceList = () => import('./views/device-list/device-list').then((m) => m.DeviceList);
const deviceForm = () => import('./views/device-form/device-form').then((m) => m.DeviceForm);
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
  { path: 'devices', loadComponent: deviceList },
  { path: 'devices/new', loadComponent: deviceForm },
  { path: 'devices/:id/edit', loadComponent: deviceForm },
  { path: 'alerts', loadComponent: alertList },
  { path: 'sensors', loadComponent: sensorList },
  { path: 'sensors/:id/assign', loadComponent: sensorAssignForm },
  { path: 'readings', loadComponent: readingHistory },
];
