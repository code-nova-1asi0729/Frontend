import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { AssetMonitoringApi } from '../infrastructure/asset-monitoring-api';
import { Building } from '../domain/model/building.entity';
import { CriticalEquipment } from '../domain/model/critical-equipment.entity';

/**
 * application state of the asset monitoring bounded context.
 * one store for the whole context: buildings, equipment, sensors, readings and alerts.
 */
@Injectable({ providedIn: 'root' })
export class AssetMonitoringStore {
  private assetMonitoringApi = inject(AssetMonitoringApi);

  private buildingsSignal = signal<Building[]>([]);
  private equipmentSignal = signal<CriticalEquipment[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly buildings = this.buildingsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /**
   * equipment linked with its building.
   */
  readonly equipment = computed(() => {
    const buildings = this.buildings();
    return this.equipmentSignal().map((item) => {
      item.building = buildings.find((building) => building.id === item.buildingId) ?? null;
      return item;
    });
  });

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
   * returns an equipment by id, or undefined while it is not loaded.
   * @param id - equipment identifier.
   */
  getEquipmentById(id: number): Signal<CriticalEquipment | undefined> {
    return computed(() => this.equipment().find((item) => item.id === id));
  }

  /**
   * returns the equipment of one building (US08).
   * @param buildingId - building identifier.
   */
  getEquipmentByBuilding(buildingId: number): Signal<CriticalEquipment[]> {
    return computed(() => this.equipment().filter((item) => item.buildingId === buildingId));
  }

  addEquipment(equipment: CriticalEquipment): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.createEquipment(equipment).subscribe({
      next: (created) => {
        this.equipmentSignal.update((items) => [...items, created]);
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to create equipment'),
    });
  }

  updateEquipment(equipment: CriticalEquipment): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.updateEquipment(equipment).subscribe({
      next: (updated) => {
        this.equipmentSignal.update((items) =>
          items.map((current) => (current.id === updated.id ? updated : current)),
        );
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to update equipment'),
    });
  }

  /**
   * takes an equipment out of service (US09). it is updated, never deleted.
   * @param equipment - equipment to decommission.
   */
  decommissionEquipment(equipment: CriticalEquipment): void {
    equipment.decommission();
    this.updateEquipment(equipment);
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
    this.assetMonitoringApi.getEquipment().subscribe({
      next: (equipment) => this.equipmentSignal.set(equipment),
      error: (error) => this.setError(error, 'Failed to load equipment'),
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
