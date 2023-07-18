import { Prisma } from '@prisma/client'
import { CategoryModelMapper } from './category.mapper'
import { CategoryEntity } from '../../../domain'
import { LoadEntityError, UniqueEntityId } from '../../../../@shared/domain'

describe('Category Mapper Unit Tests', () => {
  it('should convert an Model Category to Entity Category', () => {
    const spyToEntityMethod = jest.spyOn(CategoryModelMapper, 'toEntity')
    const date = new Date()
    const expectedEntity = new CategoryEntity(
      {
        name: 'name',
        description: 'description',
        createdAt: date,
        isActive: false,
      },
      new UniqueEntityId('id'),
    )
    const modelCategory: Prisma.CategoryMaxAggregateOutputType = {
      name: 'name',
      description: 'description',
      created_at: date,
      id: 'id',
      is_active: false,
    }

    const entityCategory = CategoryModelMapper.toEntity(modelCategory)
    expect(entityCategory.toJSON()).toEqual(expectedEntity.toJSON())
    expect(spyToEntityMethod).toHaveBeenCalledTimes(1)
  })
  it('should throw an LoadEntityError if can not convert model due validation reason', () => {
    const date = new Date()

    const modelCategory = {
      name: 'name',
      description: 1,
      created_at: date,
      id: null,
      is_active: null,
    }

    expect(() => {
      CategoryModelMapper.toEntity(modelCategory as any)
    }).toThrow(LoadEntityError)
  })
})
