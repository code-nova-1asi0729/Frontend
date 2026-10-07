import { Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { AssetMonitoringStore } from '../../../application/asset-monitoring.store';

/**
 * Lists the buildings of the administrator (US07).
 */
@Component({
  selector: 'app-building-list',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './building-list.html',
  styleUrl: './building-list.css',
})
export class BuildingList {
  readonly store = inject(AssetMonitoringStore);
  private router = inject(Router);

  displayedColumns: string[] = ['code', 'name', 'address', 'district', 'totalUnits', 'status', 'actions'];

  readonly sort = viewChild(MatSort);
  readonly paginator = viewChild(MatPaginator);

  readonly dataSource = computed(() => {
    const source = new MatTableDataSource(this.store.buildings());
    source.sort = this.sort() ?? null;
    source.paginator = this.paginator() ?? null;
    return source;
  });

  navigateToNew(): void {
    this.router.navigate(['/asset-monitoring/buildings/new']).then();
  }

  editBuilding(id: number): void {
    this.router.navigate(['/asset-monitoring/buildings', id, 'edit']).then();
  }

  deleteBuilding(id: number): void {
    this.store.deleteBuilding(id);
  }
}
