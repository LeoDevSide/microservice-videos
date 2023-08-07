/* eslint-disable no-new */
import { UniqueEntityId } from '../../../../@shared/domain'
import { GenreEntity } from '../genre.entity'

describe('Genre Entity Unit Test', () => {
  beforeEach(() => {
    GenreEntity.validate = jest.fn()
  })
  test('constructor of genre', () => {
    const categoriesId = new Map<string, UniqueEntityId>([
      ['1', new UniqueEntityId('1')],
      ['2', new UniqueEntityId('2')],
    ])
    const createdAt = new Date()
    let sendProps: any = {
      name: 'test',
      createdAt,
      categoriesId,
      isActive: false,
    }
    // @ts-expect-error
    const genreWithAllFields = new GenreEntity(
      sendProps,
      new UniqueEntityId('id-1'),
    )

    expect(genreWithAllFields.props).toStrictEqual({
      name: 'test',
      createdAt: genreWithAllFields.props.createdAt,
      categoriesId,
      isActive: false,
    })
    expect(genreWithAllFields.id).toEqual('id-1')
    expect(GenreEntity.validate).toHaveBeenCalled()

    sendProps = {
      name: 'test',
      categoriesId,
    }
    // @ts-expect-error
    const genreOptFields = new GenreEntity({ name: 'test', categoriesId })
    expect(genreOptFields.props).toStrictEqual({
      name: 'test',
      categoriesId,
      isActive: true,
      createdAt: expect.any(Date),
    })
    expect(genreOptFields.id).toBeDefined()
    expect(GenreEntity.validate).toHaveBeenCalledTimes(2)
    // @ts-expect-error
    const genreWithoutCategoriesId = new GenreEntity({ name: 'test' })
    console.log(genreWithoutCategoriesId)
  })
  test('create method of genre', () => {
    const date = new Date()
    const entityId = new UniqueEntityId()
    let sendProps = {
      name: 'test',
      categoriesId: [entityId.value],
      isActive: false,
      createdAt: date,
    }
    const genreFromStringId = GenreEntity.create(sendProps)

    expect(genreFromStringId).toBeInstanceOf(GenreEntity)
    expect(genreFromStringId.props).toEqual({
      name: 'test',
      categoriesId: expect.any(Map),
      isActive: false,
      createdAt: new Date(date.getTime()),
    })
    expect(genreFromStringId.categoriesId.size).toBe(1)
    expect(Array.from(genreFromStringId.categoriesId.keys())).toStrictEqual([
      entityId.value,
    ])
    expect(genreFromStringId.categoriesId.get(entityId.value)).toBeInstanceOf(
      UniqueEntityId,
    )
    expect(genreFromStringId.id).toBeDefined()

    sendProps = {
      name: 'test',
      categoriesId: [entityId] as any,
      isActive: false,
      createdAt: date,
    }
    const genreFromValueObj = GenreEntity.create(sendProps)

    expect(genreFromValueObj).toBeInstanceOf(GenreEntity)
    expect(genreFromValueObj.props).toEqual({
      name: 'test',
      categoriesId: expect.any(Map),
      isActive: false,
      createdAt: new Date(date.getTime()),
    })
    expect(genreFromValueObj.categoriesId.size).toBe(1)
    expect(Array.from(genreFromValueObj.categoriesId.keys())).toStrictEqual([
      entityId.value,
    ])
    expect(genreFromValueObj.categoriesId.get(entityId.value)).toBeInstanceOf(
      UniqueEntityId,
    )
    expect(genreFromValueObj.id).toBeDefined()
  })

  it('should be able to update a existent genreEntity object', () => {
    const categoryId = new UniqueEntityId()
    const categoriesId = [categoryId]
    const genreEntity = GenreEntity.create({ name: 'genre', categoriesId })

    genreEntity.update({ name: 'genre updated' })
    expect(genreEntity.props).toEqual({
      name: 'genre updated',
      categoriesId: expect.any(Map),
      isActive: true,
      createdAt: expect.any(Date),
    })
    expect(genreEntity.name).toEqual('genre updated')
  })
  it('should be able to update categories id', () => {
    const categoryId = new UniqueEntityId()
    const categoriesId = [categoryId]
    const genreEntity = GenreEntity.create({ name: 'genre', categoriesId })

    const newCategoriesId = [new UniqueEntityId(), new UniqueEntityId()]
    genreEntity.updateCategoriesId(newCategoriesId)
    expect(genreEntity.props).toEqual({
      name: 'genre',
      categoriesId: expect.any(Map),
      isActive: true,
      createdAt: expect.any(Date),
    })
    expect(genreEntity.categoriesId.size).toEqual(2)
    expect(genreEntity.categoriesId.get(newCategoriesId[0].value)).toEqual(
      newCategoriesId[0],
    )
    expect(genreEntity.categoriesId.get(newCategoriesId[1].value)).toEqual(
      newCategoriesId[1],
    )
  })
  it('should be able to remove & add category id', () => {
    const categoryId = new UniqueEntityId()
    const categoriesId = [categoryId]
    const genreEntity = GenreEntity.create({ name: 'genre', categoriesId })

    expect(genreEntity.props).toEqual({
      name: 'genre',
      categoriesId: expect.any(Map),
      isActive: true,
      createdAt: expect.any(Date),
    })
    expect(genreEntity.categoriesId.size).toEqual(1)
    genreEntity.removeCategoryId(categoryId)
    expect(genreEntity.categoriesId.size).toEqual(0)

    genreEntity.addCategoryId(categoryId)
    expect(genreEntity.categoriesId.size).toEqual(1)
    expect(genreEntity.props).toEqual({
      name: 'genre',
      categoriesId: expect.any(Map),
      isActive: true,
      createdAt: expect.any(Date),
    })
  })
})
