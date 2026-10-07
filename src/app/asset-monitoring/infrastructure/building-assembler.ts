import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Building } from '../domain/model/building.entity';
import { BuildingResource, BuildingsResponse } from './buildings-response';

/**
 * maps buildings between the API and the domain model.
 */
export class BuildingAssembler
  implements BaseAssembler<Building, BuildingResource, BuildingsResponse>
{
  toEntityFromResource(resource: BuildingResource): Building {
    return new Building({ ...resource });
  }

  toResourceFromEntity(entity: Building): BuildingResource {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      address: entity.address,
      district: entity.district,
      totalUnits: entity.totalUnits,
      status: entity.status,
    };
  }

  toEntitiesFromResponse(response: BuildingsResponse): Building[] {
    return response.buildings.map((resource) => this.toEntityFromResource(resource));
  }
}
