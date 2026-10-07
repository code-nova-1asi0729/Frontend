import { BaseEntity } from '../domain/model/base-entity';
import { BaseResource, BaseResponse } from './base-response';

/**
 * converts between domain entities and the resources exchanged with the api.
 *
 * @typeparam tentity - domain entity type.
 * @typeparam tresource - resource type sent and received by the endpoint.
 * @typeparam tresponse - envelope type returned by collection queries.
 */
export interface BaseAssembler<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TResponse extends BaseResponse,
> {
  /**
   * converts a resource into a domain entity.
   * @param resource - resource received from the api.
   */
  toEntityFromResource(resource: TResource): TEntity;

  /**
   * converts a domain entity into a resource.
   * @param entity - entity to send to the api.
   */
  toResourceFromEntity(entity: TEntity): TResource;

  /**
   * converts a response envelope into a list of domain entities.
   * @param response - envelope received from the api.
   */
  toEntitiesFromResponse(response: TResponse): TEntity[];
}
