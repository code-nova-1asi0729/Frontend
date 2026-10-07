import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';

const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);
const assetMonitoringRoutes = () =>
  import('./asset-monitoring/presentation/asset-monitoring.routes').then(
    (m) => m.assetMonitoringRoutes,
  );

const baseTitle = 'Vigilia';

/**
 * Root routes. Each bounded context adds its own child routes with lazy loading.
 */
export const routes: Routes = [
  { path: 'home', component: Home, title: `${baseTitle} - Home` },
  { path: 'asset-monitoring', loadChildren: assetMonitoringRoutes },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found` },
];
