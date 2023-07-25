import { Prisma } from '@prisma/client'
import { CategoryEntity } from '../../../domain'
import { UniqueEntityId } from '../../../../@shared/domain'
import { EntityValidationError } from '../../../../@shared/domain/errors/validation.error'
import { LoadEntityError } from '../../../../@shared/domain/errors/load-entity.error'

export class CategoryModelMapper {
  static toEntity(categoryModel: Prisma.CategoryMaxAggregateOutputType) {
    const { id, ...otherData } = categoryModel
    try {
      return new CategoryEntity(
        {
          name: otherData.name,
          description: otherData.description,
          createdAt: otherData.created_at,
          isActive: otherData.is_active,
        },
        new UniqueEntityId(id),
      )
    } catch (e) {
      if (e instanceof EntityValidationError) {
        throw new LoadEntityError(e.errors)
      }
      throw e
    }
  }
}
