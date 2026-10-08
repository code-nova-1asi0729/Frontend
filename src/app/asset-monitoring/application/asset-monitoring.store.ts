import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { AssetMonitoringApi } from '../infrastructure/asset-monitoring-api';
import { Building } from '../domain/model/building.entity';
import { CriticalEquipment } from '../domain/model/critical-equipment.entity';
import { Alert } from '../domain/model/alert.entity';
import { AlertStatus } from '../domain/model/alert-status';
import { Sensor } from '../domain/model/sensor.entity';
import { SensorReading } from '../domain/model/sensor-reading.entity';

/**
 * application state of the asset monitoring bounded context.
 * one store for the whole context: buildings, equipment, sensors, readings and alerts.
 */
@Injectable({ providedIn: 'root' })
export class AssetMonitoringStore {
  private assetMonitoringApi = inject(AssetMonitoringApi);

  private buildingsSignal = signal<Building[]>([]);
  private equipmentSignal = signal<CriticalEquipment[]>([]);
  private alertsSignal = signal<Alert[]>([]);
  private sensorsSignal = signal<Sensor[]>([]);
  private readingsSignal = signal<SensorReading[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly buildings = this.buildingsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly readings = this.readingsSignal.asReadonly();

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

  /**
   * alerts linked with the equipment they affect.
   */
  readonly alerts = computed(() => {
    const equipment = this.equipment();
    return this.alertsSignal().map((alert) => {
      alert.equipment = equipment.find((item) => item.id === alert.equipmentId) ?? null;
      return alert;
    });
  });

  /**
   * alerts that are not resolved yet, the most severe first (US19).
   */
  readonly activeAlerts = computed(() =>
    this.alerts()
      .filter((alert) => alert.isActive())
      .sort(
        (a, b) =>
          b.severityRank() - a.severityRank() || b.detectedAt.getTime() - a.detectedAt.getTime(),
      ),
  );

  /**
   * sensors linked with the equipment they measure.
   */
  readonly sensors = computed(() => {
    const equipment = this.equipment();
    return this.sensorsSignal().map((sensor) => {
      sensor.equipment = equipment.find((item) => item.id === sensor.equipmentId) ?? null;
      return sensor;
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
   * moves an alert to "acknowledged" or "resolved" (US20).
   * the entity validates the change before it is saved.
   * @param alert - alert to change.
   * @param status - new status.
   */
  changeAlertStatus(alert: Alert, status: AlertStatus): void {
    try {
      if (status === AlertStatus.ACKNOWLEDGED) alert.acknowledge();
      else if (status === AlertStatus.RESOLVED) alert.resolve();
    } catch (error) {
      this.setError(error, 'Invalid alert status change');
      return;
    }
    this.loadingSignal.set(true);
    this.assetMonitoringApi.updateAlert(alert).subscribe({
      next: (updated) => {
        this.alertsSignal.update((alerts) =>
          alerts.map((current) => (current.id === updated.id ? updated : current)),
        );
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to update alert'),
    });
  }

  /**
   * readings of one equipment, the most recent first (US14).
   * @param equipmentId - equipment identifier.
   */
  getReadingsByEquipment(equipmentId: number): Signal<SensorReading[]> {
    return computed(() =>
      this.readings()
        .filter((reading) => reading.equipmentId === equipmentId)
        .sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime()),
    );
  }

  /**
   * links a sensor to an equipment (US10).
   * if the sensor already has an equipment, the error is kept and the API is not called.
   * @param sensor - sensor to assign.
   * @param equipmentId - equipment that the sensor will measure.
   */
  assignSensor(sensor: Sensor, equipmentId: number): void {
    this.errorSignal.set(null);
    try {
      sensor.assignTo(equipmentId);
    } catch (error) {
      this.setError(error, 'The sensor cannot be assigned');
      return;
    }
    this.saveSensor(sensor);
  }

  /**
   * releases a sensor so it can be assigned to another equipment.
   * @param sensor - sensor to unassign.
   */
  unassignSensor(sensor: Sensor): void {
    this.errorSignal.set(null);
    sensor.unassign();
    this.saveSensor(sensor);
  }

  /**
   * gets the latest readings sent by the sensors, and their last signal.
   */
  reloadReadings(): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.getSensorReadings().subscribe({
      next: (readings) => {
        this.readingsSignal.set(readings);
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to load readings'),
    });
    this.assetMonitoringApi.getSensors().subscribe({
      next: (sensors) => this.sensorsSignal.set(sensors),
      error: (error) => this.setError(error, 'Failed to load sensors'),
    });
  }

  private saveSensor(sensor: Sensor): void {
    this.loadingSignal.set(true);
    this.assetMonitoringApi.updateSensor(sensor).subscribe({
      next: (updated) => {
        this.sensorsSignal.update((sensors) =>
          sensors.map((current) => (current.id === updated.id ? updated : current)),
        );
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to update sensor'),
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
    this.assetMonitoringApi.getEquipment().subscribe({
      next: (equipment) => this.equipmentSignal.set(equipment),
      error: (error) => this.setError(error, 'Failed to load equipment'),
    });
    this.assetMonitoringApi.getAlerts().subscribe({
      next: (alerts) => this.alertsSignal.set(alerts),
      error: (error) => this.setError(error, 'Failed to load alerts'),
    });
    this.assetMonitoringApi.getSensors().subscribe({
      next: (sensors) => this.sensorsSignal.set(sensors),
      error: (error) => this.setError(error, 'Failed to load sensors'),
    });
    this.assetMonitoringApi.getSensorReadings().subscribe({
      next: (readings) => this.readingsSignal.set(readings),
      error: (error) => this.setError(error, 'Failed to load readings'),
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
