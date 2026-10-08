import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { AssetMonitoringStore } from '../../../application/asset-monitoring.store';

const DAYS_SHOWN_BY_DEFAULT = 7;

/**
 * Reading history of an equipment in a date range (US14).
 */
@Component({
  selector: 'app-reading-history',
  imports: [
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './reading-history.html',
  styleUrl: './reading-history.css',
})
export class ReadingHistory {
  readonly store = inject(AssetMonitoringStore);
  private fb = inject(FormBuilder);

  readonly selectedEquipmentId = signal<number | null>(null);

  range = this.fb.group({
    start: this.fb.control<Date | null>(this.daysAgo(DAYS_SHOWN_BY_DEFAULT)),
    end: this.fb.control<Date | null>(this.daysAgo(0)),
  });

  displayedColumns: string[] = ['recordedAt', 'metric', 'value', 'sensor', 'status'];

  readonly paginator = viewChild(MatPaginator);

  private readonly rangeValue = toSignal(this.range.valueChanges, {
    initialValue: this.range.getRawValue(),
  });

  /**
   * readings of the selected equipment inside the date range, the most recent first.
   */
  readonly filteredReadings = computed(() => {
    const equipmentId = this.selectedEquipmentId();
    if (equipmentId === null) return [];
    const { start, end } = this.rangeValue();
    const from = start ? start.getTime() : -Infinity;
    // The end date includes the whole day
    const to = end ? new Date(end).setHours(23, 59, 59, 999) : Infinity;
    return this.store
      .getReadingsByEquipment(equipmentId)()
      .filter((reading) => {
        const time = reading.recordedAt.getTime();
        return time >= from && time <= to;
      });
  });

  readonly dataSource = computed(() => {
    const source = new MatTableDataSource(this.filteredReadings());
    source.paginator = this.paginator() ?? null;
    return source;
  });

  sensorSerial(sensorId: number): string {
    return this.store.sensors().find((sensor) => sensor.id === sensorId)?.serialNumber ?? '';
  }

  refresh(): void {
    this.store.reloadReadings();
  }

  private daysAgo(days: number): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - days);
    return date;
  }
}
