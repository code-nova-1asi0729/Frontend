import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { IncidentCategory } from './incident-category';
import { IncidentStatus } from './incident-status';

const MIN_SCORE = 1;
const MAX_SCORE = 5;

/**
 * problem in a common area reported by a resident (US23).
 */
export class Incident implements BaseEntity {
  #id: number;
  #buildingId: number;
  #residentId: number;
  #equipmentId: number | null;
  #category: IncidentCategory;
  #description: string;
  #status: IncidentStatus;
  #ratingScore: number | null;
  #ratingComment: string | null;
  #reportedAt: Date;
  #startedAt: Date | null;
  #resolvedAt: Date | null;
  #ratedAt: Date | null;

  constructor(props: {
    id: number;
    buildingId: number;
    residentId: number;
    equipmentId: number | null;
    category: IncidentCategory;
    description: string;
    status: IncidentStatus;
    ratingScore: number | null;
    ratingComment: string | null;
    reportedAt: Date;
    startedAt: Date | null;
    resolvedAt: Date | null;
    ratedAt: Date | null;
  }) {
    this.#id = props.id;
    this.#buildingId = props.buildingId;
    this.#residentId = props.residentId;
    this.#equipmentId = props.equipmentId;
    this.#category = props.category;
    this.#description = props.description;
    this.#status = props.status;
    this.#ratingScore = props.ratingScore;
    this.#ratingComment = props.ratingComment;
    this.#reportedAt = props.reportedAt;
    this.#startedAt = props.startedAt;
    this.#resolvedAt = props.resolvedAt;
    this.#ratedAt = props.ratedAt;
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

  get residentId(): number {
    return this.#residentId;
  }
  set residentId(value: number) {
    this.#residentId = value;
  }

  get equipmentId(): number | null {
    return this.#equipmentId;
  }
  set equipmentId(value: number | null) {
    this.#equipmentId = value;
  }

  get category(): IncidentCategory {
    return this.#category;
  }
  set category(value: IncidentCategory) {
    this.#category = value;
  }

  get description(): string {
    return this.#description;
  }
  set description(value: string) {
    this.#description = value;
  }

  get status(): IncidentStatus {
    return this.#status;
  }
  set status(value: IncidentStatus) {
    this.#status = value;
  }

  get ratingScore(): number | null {
    return this.#ratingScore;
  }
  set ratingScore(value: number | null) {
    this.#ratingScore = value;
  }

  get ratingComment(): string | null {
    return this.#ratingComment;
  }
  set ratingComment(value: string | null) {
    this.#ratingComment = value;
  }

  get reportedAt(): Date {
    return this.#reportedAt;
  }
  set reportedAt(value: Date) {
    this.#reportedAt = value;
  }

  get startedAt(): Date | null {
    return this.#startedAt;
  }
  set startedAt(value: Date | null) {
    this.#startedAt = value;
  }

  get resolvedAt(): Date | null {
    return this.#resolvedAt;
  }
  set resolvedAt(value: Date | null) {
    this.#resolvedAt = value;
  }

  get ratedAt(): Date | null {
    return this.#ratedAt;
  }
  set ratedAt(value: Date | null) {
    this.#ratedAt = value;
  }

  /**
   * the administrator starts working on a reported incident (US25).
   */
  startManagement(): void {
    if (this.#status !== IncidentStatus.REPORTED) {
      throw new Error('Only a reported incident can start its management');
    }
    this.#status = IncidentStatus.IN_PROGRESS;
    this.#startedAt = new Date();
  }

  /**
   * closes an incident that is being managed (US25).
   */
  resolve(): void {
    if (this.#status !== IncidentStatus.IN_PROGRESS) {
      throw new Error('Only an incident in progress can be resolved');
    }
    this.#status = IncidentStatus.RESOLVED;
    this.#resolvedAt = new Date();
  }

  /**
   * an incident can be rated once, after it is resolved (US27).
   */
  canBeRated(): boolean {
    return this.#status === IncidentStatus.RESOLVED && this.#ratingScore === null;
  }

  /**
   * saves the opinion of the resident about the solution (US27).
   * @param score - score from 1 to 5.
   * @param comment - optional comment of the resident.
   */
  rate(score: number, comment: string): void {
    if (!this.canBeRated()) {
      throw new Error('The incident cannot be rated');
    }
    if (!Number.isInteger(score) || score < MIN_SCORE || score > MAX_SCORE) {
      throw new Error(`The score must be between ${MIN_SCORE} and ${MAX_SCORE}`);
    }
    this.#ratingScore = score;
    this.#ratingComment = comment.trim() || null;
    this.#ratedAt = new Date();
  }
}
