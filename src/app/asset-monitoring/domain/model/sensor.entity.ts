import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { CriticalEquipment } from './critical-equipment.entity';
import { SensorStatus } from './sensor-status';

/**
 * IoT sensor that measures a critical equipment.
 * it belongs to only one equipment at a time.
 */
export class Sensor implements BaseEntity {
  #id: number;
  #equipmentId: number | null;
  #serialNumber: string;
  #model: string;
  #status: SensorStatus;
  #lastSeenAt: Date | null;
  #equipment: CriticalEquipment | null;

  constructor(props: {
    id: number;
    equipmentId: number | null;
    serialNumber: string;
    model: string;
    status: SensorStatus;
    lastSeenAt: Date | null;
    equipment?: CriticalEquipment | null;
  }) {
    this.#id = props.id;
    this.#equipmentId = props.equipmentId;
    this.#serialNumber = props.serialNumber;
    this.#model = props.model;
    this.#status = props.status;
    this.#lastSeenAt = props.lastSeenAt;
    this.#equipment = props.equipment ?? null;
  }

  get id(): number {
    return this.#id;
  }
  set id(value: number) {
    this.#id = value;
  }

  get equipmentId(): number | null {
    return this.#equipmentId;
  }
  set equipmentId(value: number | null) {
    this.#equipmentId = value;
  }

  get serialNumber(): string {
    return this.#serialNumber;
  }
  set serialNumber(value: string) {
    this.#serialNumber = value;
  }

  get model(): string {
    return this.#model;
  }
  set model(value: string) {
    this.#model = value;
  }

  get status(): SensorStatus {
    return this.#status;
  }
  set status(value: SensorStatus) {
    this.#status = value;
  }

  get lastSeenAt(): Date | null {
    return this.#lastSeenAt;
  }
  set lastSeenAt(value: Date | null) {
    this.#lastSeenAt = value;
  }

  get equipment(): CriticalEquipment | null {
    return this.#equipment;
  }
  set equipment(value: CriticalEquipment | null) {
    this.#equipment = value;
  }

  /**
   * whether the sensor is linked to an equipment.
   */
  isAssigned(): boolean {
    return this.#equipmentId !== null;
  }

  /**
   * links the sensor to an equipment (US10).
   * a sensor that already has an equipment must be unassigned first.
   * @param equipmentId - equipment that the sensor will measure.
   */
  assignTo(equipmentId: number): void {
    if (this.isAssigned()) {
      throw new Error(`Sensor ${this.#serialNumber} is already assigned to another equipment`);
    }
    this.#equipmentId = equipmentId;
    this.#status = SensorStatus.ASSIGNED;
  }

  /**
   * releases the sensor so it can be assigned again.
   */
  unassign(): void {
    this.#equipmentId = null;
    this.#equipment = null;
    this.#status = SensorStatus.UNASSIGNED;
  }
}
