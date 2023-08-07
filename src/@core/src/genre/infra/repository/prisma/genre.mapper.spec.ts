import { Prisma } from '@prisma/client'
import { GenreMapper, PrismaGenreAggregateOutputModel } from './genre.mapper'
import { GenreFakeBuilder } from '../../../domain'
import { LoadEntityError, UniqueEntityId } from '../../../../@shared/domain'
import { GenreFilter, GenreSearchParams } from '../genre.repository'
import { CategoryFakeBuilder } from '../../../../category/domain'

describe('Genre Mapper Unit Tests', () => {
  it('should convert an UniqueId Map to array', () => {
    const spyToEntityMethod = jest.spyOn(GenreMapper, '_categoriesIdMapToArray')
    const map = new Map<string, UniqueEntityId>([
      ['123', new UniqueEntityId('123')],
      ['321', new UniqueEntityId('321')],
    ])

    const expected = ['123', '321']
    const converted = GenreMapper._categoriesIdMapToArray(map)
    expect(converted).toStrictEqual(expected)
    expect(spyToEntityMethod).toHaveBeenCalledTimes(1)
  })
  it('should convert an Model Genre to Entity Genre', () => {
    const spyToEntityMethod = jest.spyOn(GenreMapper, 'toEntity')
    const date = new Date()
    const category = CategoryFakeBuilder.aCategory().build()
    const expectedEntity = GenreFakeBuilder.aGenre()
      .withEntityId(new UniqueEntityId('123'))
      .withCreatedAt(date)
      .withName('name')
      .activate()
      .withCategoryId(new UniqueEntityId(category.id))
      .build()

    const modelGenre: PrismaGenreAggregateOutputModel = {
      name: 'name',
      created_at: date,
      id: '123',
      is_active: true,
      categories: [{ category_id: category.id, genre_id: '123' }],
    }

    const entityGenre = GenreMapper.toEntity(modelGenre)
    expect(entityGenre.toJSON()).toStrictEqual(expectedEntity.toJSON())
    expect(spyToEntityMethod).toHaveBeenCalledTimes(1)
  })

  it('should convert an Entity Genre to Model Genre ', () => {
    const spyToModelMethod = jest.spyOn(GenreMapper, 'toModel')
    const date = new Date()
    const entity = GenreFakeBuilder.aGenre()
      .withEntityId(new UniqueEntityId('123'))
      .withCreatedAt(date)
      .withName('name')
      .withCategoryId(new UniqueEntityId('abc'))
      .deactivate()
      .build()

    const expectedModel: Prisma.GenreMaxAggregateOutputType = {
      name: 'name',
      created_at: date,
      id: '123',
      is_active: false,
    }
    const toModel = GenreMapper.toModel(entity)

    expect(toModel).toStrictEqual(expectedModel)
    expect(spyToModelMethod).toHaveBeenCalledTimes(1)
  })

  it('should convert an Entity Genre to Create Genre Prisma Args ', () => {
    const spyToModelMethod = jest.spyOn(GenreMapper, 'toCreateModel')
    const date = new Date()
    const entity = GenreFakeBuilder.aGenre()
      .withEntityId(new UniqueEntityId('123'))
      .withCreatedAt(date)
      .withName('name')
      .withCategoryId(new UniqueEntityId('abc'))
      .deactivate()
      .build()

    const expectedModel: Prisma.GenreCreateArgs = {
      data: {
        id: entity.id,
        name: entity.name,
        is_active: entity.isActive,
        created_at: entity.createdAt,
        categories: {
          create: [{ category_id: 'abc' }],
        },
      },
    }
    const toModel = GenreMapper.toCreateModel(entity)
    console.log(toModel.data.categories)
    expect(toModel).toStrictEqual(expectedModel)
    expect(spyToModelMethod).toHaveBeenCalledTimes(1)
  })
  // it('should convert an Entity Genre to Update Genre Prisma Args ', () => {
  //   const spyToModelMethod = jest.spyOn(GenreMapper, 'toUpdateModel')
  //   const date = new Date()
  //   const entity = GenreFakeBuilder.aGenre()
  //     .withEntityId(new UniqueEntityId('123'))
  //     .withCreatedAt(date)
  //     .withName('name')
  //     .withCategoryId(new UniqueEntityId('abc'))
  //     .deactivate()
  //     .build()

  //   const expectedModel: Prisma.GenreUpdateArgs = {
  //     where: { id: entity.id },
  //     data: {
  //       name: entity.name,
  //       is_active: entity.isActive,
  //       created_at: entity.createdAt,
  //       categories: {
  //         set: [{ id: 'abc' }],
  //       },
  //     },
  //   }
  //   const toModel = GenreMapper.toUpdateModel(entity)

  //   expect(toModel).toStrictEqual(expectedModel)
  //   expect(spyToModelMethod).toHaveBeenCalledTimes(1)
  // })

  it('should convert an Domain Filter Genre to Filter Model ', () => {
    const spyMethod = jest.spyOn(GenreMapper, 'filterToModel')
    let domainFilter: GenreFilter = {
      name: 'ok',
      categoryId: '123',
      is_active: true,
    }
    let modelFilter: Prisma.GenreWhereInput =
      GenreMapper.filterToModel(domainFilter)

    let expectedModelFilter: Prisma.GenreWhereInput = {
      name: { contains: 'ok', mode: 'insensitive' },
      categories: { some: { category_id: { equals: '123' } } },
      is_active: { equals: true },
    }
    expect(modelFilter).toStrictEqual(expectedModelFilter)
    expect(spyMethod).toHaveBeenCalledTimes(1)

    domainFilter = {
      name: 'ok',
    }
    modelFilter = GenreMapper.filterToModel(domainFilter)

    expectedModelFilter = {
      name: { contains: 'ok', mode: 'insensitive' },
    }
    expect(modelFilter).toStrictEqual(expectedModelFilter)
    expect(spyMethod).toHaveBeenCalledTimes(2)

    domainFilter = {
      is_active: true,
    }
    modelFilter = GenreMapper.filterToModel(domainFilter)

    expectedModelFilter = {
      is_active: { equals: true },
    }
    expect(modelFilter).toStrictEqual(expectedModelFilter)
    expect(spyMethod).toHaveBeenCalledTimes(3)

    domainFilter = {
      categoryId: '123',
    }
    modelFilter = GenreMapper.filterToModel(domainFilter)

    expectedModelFilter = {
      categories: { some: { category_id: { equals: '123' } } },
    }
    expect(modelFilter).toStrictEqual(expectedModelFilter)
    expect(spyMethod).toHaveBeenCalledTimes(4)
  })
  it('should convert an Domain Search Params to Model Search Params ', () => {
    const spyFilterMethod = jest.spyOn(GenreMapper, 'filterToModel')
    const spySearchToModelMethod = jest.spyOn(GenreMapper, 'filterToModel')

    const domainSearchParams: GenreSearchParams = new GenreSearchParams({
      filter: { name: 'foo', categoryId: '123' },
      page: 4,
      perPage: 40,
      sort: 'name',
      sortDir: 'desc',
    })
    const searchParamsModel: Prisma.GenreFindManyArgs =
      GenreMapper.searchParamsToModel(domainSearchParams)

    const expectedSearchParamsModel: Prisma.GenreFindManyArgs = {
      where: {
        name: { contains: 'foo', mode: 'insensitive' },
        categories: { some: { category_id: { equals: '123' } } },
      },
      orderBy: { name: 'desc' },
      skip: 120,
      take: 40,
    }
    expect(searchParamsModel).toStrictEqual(expectedSearchParamsModel)

    expect(spyFilterMethod).toHaveBeenCalledTimes(1)
    expect(spySearchToModelMethod).toHaveBeenCalledTimes(1)
  })

  it('should convert an default Domain Search Params to Model Search Params ', () => {
    const spyFilterMethod = jest.spyOn(GenreMapper, 'filterToModel')
    const spySearchToModelMethod = jest.spyOn(GenreMapper, 'filterToModel')

    const domainSearchParams: GenreSearchParams = new GenreSearchParams()
    const searchParamsModel: Prisma.GenreFindManyArgs =
      GenreMapper.searchParamsToModel(domainSearchParams)

    const expectedSearchParamsModel: Prisma.GenreFindManyArgs = {
      where: undefined,
      orderBy: { created_at: 'desc' },
      skip: 0,
      take: 15,
    }
    expect(searchParamsModel).toStrictEqual(expectedSearchParamsModel)

    expect(spyFilterMethod).toHaveBeenCalledTimes(1)
    expect(spySearchToModelMethod).toHaveBeenCalledTimes(1)
  })
  it('should throw an LoadEntityError if can not convert model due validation reason', () => {
    const date = new Date()

    const modelGenre = {
      name: 123,
      created_at: date,
      id: null,
      categories: [{ id: '123' }],
    }
    expect(() => {
      GenreMapper.toEntity(modelGenre as any)
    }).toThrow(LoadEntityError)
  })

  it('should throw an Error if can not load categoriesId', () => {
    const date = new Date()

    const modelGenre = {
      name: 'ok',
      created_at: date,
      id: 'ok',
      is_active: false,
      categories: undefined,
    }
    expect(() => {
      GenreMapper.toEntity(modelGenre as any)
    }).toThrow()
  })
})
