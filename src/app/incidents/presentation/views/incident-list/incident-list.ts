import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { IncidentsStore } from '../../../application/incidents.store';
import { Incident } from '../../../domain/model/incident.entity';
import { IncidentStatus } from '../../../domain/model/incident-status';
import { AssetMonitoringStore } from '../../../../asset-monitoring/application/asset-monitoring.store';

/**
 * Lists the incidents and moves them through their follow-up (US25).
 */
@Component({
  selector: 'app-incident-list',
  imports: [
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './incident-list.html',
  styleUrl: './incident-list.css',
})
export class IncidentList {
  readonly store = inject(IncidentsStore);
  private router = inject(Router);
  private assetMonitoringStore = inject(AssetMonitoringStore);

  displayedColumns: string[] = [
    'reportedAt',
    'building',
    'category',
    'description',
    'status',
    'rating',
    'actions',
  ];

  readonly stars = [1, 2, 3, 4, 5];

  /**
   * name of the building where the incident was reported.
   * @param buildingId - building identifier.
   */
  buildingName(buildingId: number): string {
    return this.assetMonitoringStore.buildings().find((building) => building.id === buildingId)?.name ?? '—';
  }

  isReported(incident: Incident): boolean {
    return incident.status === IncidentStatus.REPORTED;
  }

  isInProgress(incident: Incident): boolean {
    return incident.status === IncidentStatus.IN_PROGRESS;
  }

  navigateToNew(): void {
    this.router.navigate(['/incidents/new']).then();
  }

  startManagement(incident: Incident): void {
    this.store.startManagement(incident);
  }

  resolve(incident: Incident): void {
    this.store.resolveIncident(incident);
  }

  rate(id: number): void {
    this.router.navigate(['/incidents', id, 'rate']).then();
  }
}
