import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IncidentsApi } from '../infrastructure/incidents-api';
import { Incident } from '../domain/model/incident.entity';

/**
 * application state of the incidents bounded context.
 */
@Injectable({ providedIn: 'root' })
export class IncidentsStore {
  private incidentsApi = inject(IncidentsApi);

  private incidentsSignal = signal<Incident[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  /**
   * incidents sorted from the most recent to the oldest.
   */
  readonly incidents = computed(() =>
    [...this.incidentsSignal()].sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime()),
  );
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    this.loadIncidents();
  }

  /**
   * returns an incident by id, or undefined while it is not loaded.
   * @param id - incident identifier.
   */
  getIncidentById(id: number): Signal<Incident | undefined> {
    return computed(() => this.incidents().find((incident) => incident.id === id));
  }

  /**
   * registers a new incident reported by a resident (US23).
   * @param incident - incident to report.
   */
  reportIncident(incident: Incident): void {
    this.errorSignal.set(null);
    this.loadingSignal.set(true);
    this.incidentsApi.createIncident(incident).subscribe({
      next: (created) => {
        this.incidentsSignal.update((incidents) => [...incidents, created]);
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to report incident'),
    });
  }

  /**
   * moves a reported incident to "in progress" (US25).
   * @param incident - incident to manage.
   */
  startManagement(incident: Incident): void {
    this.changeAndSave(
      () => incident.startManagement(),
      () => this.incidentsApi.startManagement(incident.id),
    );
  }

  /**
   * moves an incident in progress to "resolved" (US25).
   * @param incident - incident to resolve.
   */
  resolveIncident(incident: Incident): void {
    this.changeAndSave(
      () => incident.resolve(),
      () => this.incidentsApi.resolveIncident(incident.id),
    );
  }

  /**
   * saves the rating of a resolved incident. it can be rated only once (US27).
   * @param incident - incident to rate.
   * @param score - score from 1 to 5.
   * @param comment - comment of the resident.
   */
  rateIncident(incident: Incident, score: number, comment: string): void {
    this.changeAndSave(
      () => incident.rate(score, comment),
      () => this.incidentsApi.rateIncident(incident.id, score, comment),
    );
  }

  /**
   * applies a business rule of the entity and, only if the rule allows it, sends the command to the API.
   * @param change - business rule of the entity.
   * @param request - API call of the business command.
   */
  private changeAndSave(change: () => void, request: () => Observable<Incident>): void {
    this.errorSignal.set(null);
    try {
      change();
    } catch (error) {
      this.setError(error, 'Invalid incident change');
      return;
    }
    this.save(request());
  }

  private save(request: Observable<Incident>): void {
    this.loadingSignal.set(true);
    request.subscribe({
      next: (updated) => {
        this.incidentsSignal.update((incidents) =>
          incidents.map((current) => (current.id === updated.id ? updated : current)),
        );
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to update incident'),
    });
  }

  private loadIncidents(): void {
    this.loadingSignal.set(true);
    this.incidentsApi.getIncidents().subscribe({
      next: (incidents) => {
        this.incidentsSignal.set(incidents);
        this.loadingSignal.set(false);
      },
      error: (error) => this.setError(error, 'Failed to load incidents'),
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
