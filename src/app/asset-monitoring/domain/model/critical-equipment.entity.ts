import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Building } from './building.entity';
import { EquipmentStatus } from './equipment-status';
import { EquipmentType } from './equipment-type';

/**
 * critical equipment of a building: water pump, electrical panel, elevator or hvac.
 */
export class CriticalEquipment implements BaseEntity {
  #id: number;
  #buildingId: number;
  #code: string;
  #name: string;
  #type: EquipmentType;
  #location: string;
  #installationDate: Date;
  #status: EquipmentStatus;
  #building: Building | null;

  constructor(props: {
    id: number;
    buildingId: number;
    code: string;
    name: string;
    type: EquipmentType;
    location: string;
    installationDate: Date;
    status: EquipmentStatus;
    building?: Building | null;
  }) {
    this.#id = props.id;
    this.#buildingId = props.buildingId;
    this.#code = props.code;
    this.#name = props.name;
    this.#type = props.type;
    this.#location = props.location;
    this.#installationDate = props.installationDate;
    this.#status = props.status;
    this.#building = props.building ?? null;
  }

  get id(): number {
    return this.#id;
  }
  set id(value: number) {
    this.#id = value;
  }

  get buildingId(): number {
    return this.#buildingId;
  }
  set buildingId(value: number) {
    this.#buildingId = value;
  }

  get code(): string {
    return this.#code;
  }
  set code(value: string) {
    this.#code = value;
  }

  get name(): string {
    return this.#name;
  }
  set name(value: string) {
    this.#name = value;
  }

  get type(): EquipmentType {
    return this.#type;
  }
  set type(value: EquipmentType) {
    this.#type = value;
  }

  get location(): string {
    return this.#location;
  }
  set location(value: string) {
    this.#location = value;
  }

  get installationDate(): Date {
    return this.#installationDate;
  }
  set installationDate(value: Date) {
    this.#installationDate = value;
  }

  get status(): EquipmentStatus {
    return this.#status;
  }
  set status(value: EquipmentStatus) {
    this.#status = value;
  }

  get building(): Building | null {
    return this.#building;
  }
  set building(value: Building | null) {
    this.#building = value;
  }

  /**
   * an equipment is operational when it works without pending follow-up.
   */
  isOperational(): boolean {
    return this.#status === EquipmentStatus.OPERATIONAL;
  }

  /**
   * whether the equipment was taken out of service permanently (US09).
   */
  isDecommissioned(): boolean {
    return this.#status === EquipmentStatus.DECOMMISSIONED;
  }

  /**
   * takes the equipment out of service permanently (US09).
   * the equipment is not deleted, so its history is kept.
   */
  decommission(): void {
    this.#status = EquipmentStatus.DECOMMISSIONED;
  }
}
