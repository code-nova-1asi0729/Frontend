import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { AssetMonitoringApi } from '../infrastructure/asset-monitoring-api';
import { Building } from '../domain/model/building.entity';

/**
 * application state of the asset monitoring bounded context.
 * one store for the whole context: buildings, equipment, sensors, readings and alerts.
 */
@Injectable({ providedIn: 'root' })
export class AssetMonitoringStore {
  private assetMonitoringApi = inject(AssetMonitoringApi);

  private buildingsSignal = signal<Building[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly buildings = this.buildingsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    this.loadAll();
  }

  /**
   * returns a building by id, or undefined while it is not loaded.
   * @param id - building identifier.
   */
  getBuildingById(id: number): Signal<Building | undefined> {
    return computed(() => this.buildings().find((building) => building.id === id));
  }

  addBuilding(building: Building): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.createBuilding(building).subscribe({
      next: (created) => {
        this.buildingsSignal.update((buildings) => [...buildings, created]);
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to create building'),
    });
  }

  updateBuilding(building: Building): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.updateBuilding(building).subscribe({
      next: (updated) => {
        this.buildingsSignal.update((buildings) =>
          buildings.map((current) => (current.id === updated.id ? updated : current)),
        );
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to update building'),
    });
  }

  deleteBuilding(id: number): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.deleteBuilding(id).subscribe({
      next: () => {
        this.buildingsSignal.update((buildings) => buildings.filter((b) => b.id !== id));
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to delete building'),
    });
  }

  /**
   * loads the initial data of the context. add here the loaders of new resources.
   */
  private loadAll(): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.getBuildings().subscribe({
      next: (buildings) => {
        this.buildingsSignal.set(buildings);
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to load buildings'),
    });
  }

  private setError(error: unknown, fallback: string): void {
    this.errorSignal.set(this.formatError(error, fallback));
    this.loadingSignal.set(false);
  }

  private formatError(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
