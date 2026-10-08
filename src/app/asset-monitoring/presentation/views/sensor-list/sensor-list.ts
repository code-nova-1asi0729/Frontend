import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { AssetMonitoringStore } from '../../../application/asset-monitoring.store';
import { Sensor } from '../../../domain/model/sensor.entity';

/**
 * Lists the IoT sensors and the equipment they measure (US10).
 */
@Component({
  selector: 'app-sensor-list',
  imports: [
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './sensor-list.html',
  styleUrl: './sensor-list.css',
})
export class SensorList {
  readonly store = inject(AssetMonitoringStore);
  private router = inject(Router);

  displayedColumns: string[] = [
    'serialNumber',
    'model',
    'equipment',
    'status',
    'lastSeenAt',
    'actions',
  ];

  assignSensor(id: number): void {
    this.router.navigate(['/asset-monitoring/sensors', id, 'assign']).then();
  }

  unassignSensor(sensor: Sensor): void {
    this.store.unassignSensor(sensor);
  }
}
