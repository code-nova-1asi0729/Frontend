import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { AssetMonitoringStore } from '../../../application/asset-monitoring.store';
import { Alert } from '../../../domain/model/alert.entity';
import { AlertSeverity } from '../../../domain/model/alert-severity';
import { AlertStatus } from '../../../domain/model/alert-status';
import { DeviceType } from '../../../domain/model/device-type';
import { TranslateService } from '@ngx-translate/core';

/**
 * unit of each monitored metric.
 */
const METRIC_UNITS: Record<string, string> = {
  VIBRATION: 'mm/s',
  TEMPERATURE: '°C',
  HUMIDITY: '%',
  POWER_CONSUMPTION: 'kW',
  CURRENT: 'A',
  PRESSURE: 'bar',
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
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './alert-list.html',
  styleUrl: './alert-list.css',
})
export class AlertList {
  readonly store = inject(AssetMonitoringStore);
  private translate = inject(TranslateService);

  displayedColumns: string[] = [
    'severity',
    'device',
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

  /**
   * building chosen in the filter. null shows the alerts of every building.
   */
  readonly buildingFilter = signal<number | null>(null);

  /**
   * device types offered in the type filter.
   */
  readonly deviceTypes = Object.values(DeviceType);

  /**
   * device type chosen in the filter. null shows every type.
   */
  readonly typeFilter = signal<string | null>(null);

  /**
   * alerts of the table after the "show resolved" toggle and the filters.
   * the severity cards keep counting every active alert.
   */
  readonly visibleAlerts = computed(() => {
    const resolved = this.showResolved() ? this.store.alerts().filter((alert) => !alert.isActive()) : [];
    return [...this.store.activeAlerts(), ...resolved].filter(
      (alert) =>
        (this.buildingFilter() === null || alert.device?.buildingId === this.buildingFilter()) &&
        (this.typeFilter() === null || alert.device?.type === this.typeFilter()),
    );
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
    const message = this.translate.instant('alerts.resolve-confirm', {
      device: alert.device?.name ?? '',
      severity: this.translate.instant('alerts.severities.' + alert.severity),
    });
    if (!confirm(message)) return;
    this.store.changeAlertStatus(alert, AlertStatus.RESOLVED);
  }
}
