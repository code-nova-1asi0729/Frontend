import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AssetMonitoringStore } from '../../../application/asset-monitoring.store';
import { CriticalEquipment } from '../../../domain/model/critical-equipment.entity';

/**
 * Lists the critical equipment by building (US08) and decommissions it (US09).
 */
@Component({
  selector: 'app-equipment-list',
  imports: [
    DatePipe,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './equipment-list.html',
  styleUrl: './equipment-list.css',
})
export class EquipmentList {
  readonly store = inject(AssetMonitoringStore);
  private router = inject(Router);
  private translate = inject(TranslateService);

  displayedColumns: string[] = [
    'code',
    'name',
    'type',
    'building',
    'location',
    'installationDate',
    'status',
    'actions',
  ];

  /**
   * building chosen in the filter. null shows the equipment of every building.
   */
  readonly selectedBuildingId = signal<number | null>(null);

  readonly sort = viewChild(MatSort);
  readonly paginator = viewChild(MatPaginator);

  readonly filteredEquipment = computed(() => {
    const buildingId = this.selectedBuildingId();
    const equipment = this.store.equipment();
    return buildingId === null
      ? equipment
      : equipment.filter((item) => item.buildingId === buildingId);
  });

  readonly dataSource = computed(() => {
    const source = new MatTableDataSource(this.filteredEquipment());
    // Sort the building and date columns by a comparable value instead of the object
    source.sortingDataAccessor = (item, column) => {
      if (column === 'building') return item.building?.name ?? '';
      if (column === 'installationDate') return item.installationDate.getTime();
      return (item as unknown as Record<string, string | number>)[column];
    };
    source.sort = this.sort() ?? null;
    source.paginator = this.paginator() ?? null;
    return source;
  });

  navigateToNew(): void {
    const buildingId = this.selectedBuildingId();
    this.router
      .navigate(['/asset-monitoring/equipment/new'], {
        queryParams: buildingId === null ? {} : { buildingId },
      })
      .then();
  }

  editEquipment(id: number): void {
    this.router.navigate(['/asset-monitoring/equipment', id, 'edit']).then();
  }

  decommissionEquipment(equipment: CriticalEquipment): void {
    const message = this.translate.instant('equipment.decommission-confirm', {
      name: equipment.name,
    });
    if (!confirm(message)) return;
    this.store.decommissionEquipment(equipment);
  }
}
