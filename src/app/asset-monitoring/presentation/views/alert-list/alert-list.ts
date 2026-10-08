import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { AssetMonitoringStore } from '../../../application/asset-monitoring.store';
import { Alert } from '../../../domain/model/alert.entity';
import { AlertSeverity } from '../../../domain/model/alert-severity';
import { AlertStatus } from '../../../domain/model/alert-status';

/**
 * unit of each monitored metric.
 */
const METRIC_UNITS: Record<string, string> = {
  VIBRATION: 'mm/s',
  TEMPERATURE: '°C',
  HUMIDITY: '%',
  POWER_CONSUMPTION: 'kW',
};

/**
 * Dashboard of the administrator: active alerts sorted by severity (US19)
 * and their status changes (US20).
 */
@Component({
  selector: 'app-alert-list',
  imports: [
    DatePipe,
    DecimalPipe,
    MatTableModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './alert-list.html',
  styleUrl: './alert-list.css',
})
export class AlertList {
  readonly store = inject(AssetMonitoringStore);

  displayedColumns: string[] = [
    'severity',
    'equipment',
    'metric',
    'lastValue',
    'detectedAt',
    'status',
    'actions',
  ];

  /**
   * severities from the most to the least urgent, in the order of the cards.
   */
  readonly severities = [
    AlertSeverity.CRITICAL,
    AlertSeverity.HIGH,
    AlertSeverity.MEDIUM,
    AlertSeverity.LOW,
  ];

  /**
   * when true, the table also shows the resolved alerts.
   */
  readonly showResolved = signal<boolean>(false);

  /**
   * number of active alerts of each severity.
   */
  readonly countBySeverity = computed(() => {
    const counts: Record<string, number> = {};
    for (const severity of this.severities) counts[severity] = 0;
    for (const alert of this.store.activeAlerts()) counts[alert.severity]++;
    return counts;
  });

  readonly visibleAlerts = computed(() => {
    if (!this.showResolved()) return this.store.activeAlerts();
    const resolved = this.store.alerts().filter((alert) => !alert.isActive());
    return [...this.store.activeAlerts(), ...resolved];
  });

  unitOf(metric: string): string {
    return METRIC_UNITS[metric] ?? '';
  }

  canAcknowledge(alert: Alert): boolean {
    return alert.status === AlertStatus.ACTIVE;
  }

  acknowledge(alert: Alert): void {
    this.store.changeAlertStatus(alert, AlertStatus.ACKNOWLEDGED);
  }

  resolve(alert: Alert): void {
    this.store.changeAlertStatus(alert, AlertStatus.RESOLVED);
  }
}
