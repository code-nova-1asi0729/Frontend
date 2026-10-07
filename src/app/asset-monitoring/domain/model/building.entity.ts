import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * condominium registered in Vigilia. groups the critical equipment.
 */
export class Building implements BaseEntity {
  #id: number;
  #name: string;
  #code: string;
  #address: string;
  #district: string;
  #totalUnits: number;
  #status: string;

  constructor(props: {
    id: number;
    name: string;
    code: string;
    address: string;
    district: string;
    totalUnits: number;
    status: string;
  }) {
    this.#id = props.id;
    this.#name = props.name;
    this.#code = props.code;
    this.#address = props.address;
    this.#district = props.district;
    this.#totalUnits = props.totalUnits;
    this.#status = props.status;
  }

  get id(): number {
    return this.#id;
  }
  set id(value: number) {
    this.#id = value;
  }

  get name(): string {
    return this.#name;
  }
  set name(value: string) {
    this.#name = value;
  }

  get code(): string {
    return this.#code;
  }
  set code(value: string) {
    this.#code = value;
  }

  get address(): string {
    return this.#address;
  }
  set address(value: string) {
    this.#address = value;
  }

  get district(): string {
    return this.#district;
  }
  set district(value: string) {
    this.#district = value;
  }

  get totalUnits(): number {
    return this.#totalUnits;
  }
  set totalUnits(value: number) {
    this.#totalUnits = value;
  }

  get status(): string {
    return this.#status;
  }
  set status(value: string) {
    this.#status = value;
  }

  /**
   * a building is active while it is affiliated to the platform.
   */
  isActive(): boolean {
    return this.#status === 'ACTIVE';
  }
}
