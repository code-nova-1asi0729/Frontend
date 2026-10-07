import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseEntity } from '../domain/model/base-entity';
import { BaseAssembler } from './base-assembler';
import { BaseResource, BaseResponse } from './base-response';

/**
 * generic crud operations for one rest endpoint.
 *
 * @typeparam tentity - domain entity handled by the endpoint.
 * @typeparam tresource - resource exchanged with the api.
 * @typeparam tresponse - envelope returned by collection queries.
 * @typeparam tassembler - mapper between entities and resources.
 */
export abstract class BaseApiEndpoint<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TResponse extends BaseResponse,
  TAssembler extends BaseAssembler<TEntity, TResource, TResponse>,
> {
  protected constructor(
    protected http: HttpClient,
    protected endpointUrl: string,
    protected assembler: TAssembler,
  ) {}

  /**
   * gets every entity of the endpoint.
   */
  getAll(): Observable<TEntity[]> {
    return this.http.get<TResponse | TResource[]>(this.endpointUrl).pipe(
      map((response) =>
        Array.isArray(response)
          ? response.map((resource) => this.assembler.toEntityFromResource(resource))
          : this.assembler.toEntitiesFromResponse(response),
      ),
      catchError(this.handleError('Failed to fetch entities')),
    );
  }

  /**
   * gets one entity by its identifier.
   * @param id - entity identifier.
   */
  getById(id: number): Observable<TEntity> {
    return this.http.get<TResource>(`${this.endpointUrl}/${id}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to fetch entity')),
    );
  }

  /**
   * creates a new entity.
   * @param entity - entity to create.
   */
  create(entity: TEntity): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.post<TResource>(this.endpointUrl, resource).pipe(
      map((created) => this.assembler.toEntityFromResource(created)),
      catchError(this.handleError('Failed to create entity')),
    );
  }

  /**
   * updates an existing entity.
   * @param entity - entity with the new values.
   * @param id - identifier of the entity to update.
   */
  update(entity: TEntity, id: number): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.put<TResource>(`${this.endpointUrl}/${id}`, resource).pipe(
      map((updated) => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update entity')),
    );
  }

  /**
   * deletes an entity by its identifier.
   * @param id - identifier of the entity to delete.
   */
  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.endpointUrl}/${id}`)
      .pipe(catchError(this.handleError('Failed to delete entity')));
  }

  /**
   * builds an error handler that turns http errors into readable messages.
   * @param operation - name of the operation that failed.
   */
  protected handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let message = `${operation}: ${error.statusText || 'Unexpected error'}`;
      if (error.status === 404) message = `${operation}: Resource not found`;
      else if (error.error instanceof ErrorEvent) message = `${operation}: ${error.error.message}`;
      return throwError(() => new Error(message));
    };
  }
}
