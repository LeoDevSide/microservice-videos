import { UniqueEntityId } from '../../../../@shared/domain'
import { CategoryEntity } from '../category.entity'

describe('Category Entity Unit Test', () => {
  test('constructor of category', () => {
    const createdAt = new Date()
    const categoryWithAllFields = new CategoryEntity(
      {
        name: 'test',
        description: 'test description',
        isActive: false,
        createdAt,
      },
      new UniqueEntityId('id-1'),
    )

    expect(categoryWithAllFields.props).toEqual({
      name: 'test',
      description: 'test description',
      isActive: false,
      createdAt,
    })
    expect(categoryWithAllFields.id).toEqual('id-1')

    const categoryOptFields = new CategoryEntity({ name: 'test' })
    expect(categoryOptFields.isActive).toBe(true)
    expect(categoryOptFields.createdAt).toBeTruthy()
    expect(categoryOptFields.description).toBeNull()
    expect(categoryOptFields.name).toBe('test')
    expect(categoryOptFields.id).not.toBeNull()
    expect(categoryOptFields.id).toBeTruthy()

    const categoryWithNullId = new CategoryEntity({ name: 'test' }, null)
    expect(categoryWithNullId.isActive).toBe(true)
    expect(categoryWithNullId.createdAt).toBeTruthy()
    expect(categoryWithNullId.description).toBeNull()
    expect(categoryWithNullId.name).toBe('test')
    expect(categoryWithNullId.id).not.toBeNull()
    expect(categoryWithNullId.id).toBeTruthy()

    const categoryWithUndefinedId = new CategoryEntity(
      { name: 'test' },
      undefined,
    )
    expect(categoryWithUndefinedId.isActive).toBe(true)
    expect(categoryWithUndefinedId.createdAt).toBeTruthy()
    expect(categoryWithUndefinedId.description).toBeNull()
    expect(categoryWithUndefinedId.name).toBe('test')
    expect(categoryWithUndefinedId.id).not.toBeNull()
    expect(categoryWithUndefinedId.id).toBeTruthy()
  })
  it('should be able to update a existent categoryEntity object', () => {
    const createdAt = new Date()
    const categoryEntity = new CategoryEntity(
      {
        name: 'test',
        description: 'test description',
        isActive: false,
        createdAt,
      },
      new UniqueEntityId('id-1'),
    )

    categoryEntity.update({
      description: 'new desc value',
      name: 'new name value',
    })

    expect(categoryEntity.name).toEqual('new name value')
    expect(categoryEntity.description).toEqual('new desc value')
  })
  it('should be able to activate & deactivate categoryEntity object', () => {
    const createdAt = new Date()
    const categoryEntity = new CategoryEntity(
      {
        name: 'test',
        description: 'test description',
        isActive: false,
        createdAt,
      },
      new UniqueEntityId('id-1'),
    )

    categoryEntity.activate()
    expect(categoryEntity.isActive).toEqual(true)

    categoryEntity.deactivate()
    expect(categoryEntity.isActive).toEqual(false)
  })
})
