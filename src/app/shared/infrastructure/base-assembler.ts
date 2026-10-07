import { BaseEntity } from '../domain/model/base-entity';
import { BaseResource, BaseResponse } from './base-response';

/**
 * Converts between domain entities and the resources exchanged with the API.
 *
 * @typeParam TEntity - Domain entity type.
 * @typeParam TResource - Resource type sent and received by the endpoint.
 * @typeParam TResponse - Envelope type returned by collection queries.
 */
export interface BaseAssembler<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TResponse extends BaseResponse,
> {
  /**
   * Converts a resource into a domain entity.
   * @param resource - Resource received from the API.
   */
  toEntityFromResource(resource: TResource): TEntity;

  /**
   * Converts a domain entity into a resource.
   * @param entity - Entity to send to the API.
   */
  toResourceFromEntity(entity: TEntity): TResource;

  /**
   * Converts a response envelope into a list of domain entities.
   * @param response - Envelope received from the API.
   */
  toEntitiesFromResponse(response: TResponse): TEntity[];
}
