import { Prisma } from '@prisma/client'
import { CastMemberMapper, PrismaCastMemberType } from './cast-member.mapper'
import { CastMemberFakeBuilder, CastMemberType } from '../../../domain'
import { LoadEntityError, UniqueEntityId } from '../../../../@shared/domain'
import {
  CastMemberFilter,
  CastMemberSearchParams,
} from '../cast-member.repository'

describe('CastMember Mapper Unit Tests', () => {
  it('should convert an Model CastMember to Entity CastMember', () => {
    const spyToEntityMethod = jest.spyOn(CastMemberMapper, 'toEntity')
    const date = new Date()
    const expectedEntity = CastMemberFakeBuilder.aCastMember()
      .withEntityId(new UniqueEntityId('123'))
      .withCreatedAt(date)
      .withName('name')
      .withType(CastMemberType.ACTOR)
      .build()

    const modelCastMember: Prisma.CastMemberMaxAggregateOutputType = {
      name: 'name',
      created_at: date,
      id: '123',
      type: PrismaCastMemberType.ACTOR,
    }

    const entityCastMember = CastMemberMapper.toEntity(modelCastMember)
    expect(entityCastMember.toJSON()).toStrictEqual(expectedEntity.toJSON())
    expect(spyToEntityMethod).toHaveBeenCalledTimes(1)
  })

  it('should convert an Entity CastMember to Model CastMember ', () => {
    const spyToModelMethod = jest.spyOn(CastMemberMapper, 'toModel')
    const date = new Date()
    const entity = CastMemberFakeBuilder.aCastMember()
      .withEntityId(new UniqueEntityId('123'))
      .withCreatedAt(date)
      .withName('name')
      .withType(CastMemberType.ACTOR)
      .build()

    const expectedModel: Prisma.CastMemberMaxAggregateOutputType = {
      name: 'name',
      created_at: date,
      id: '123',
      type: PrismaCastMemberType.ACTOR,
    }
    const toModel = CastMemberMapper.toModel(entity)

    expect(toModel).toStrictEqual(expectedModel)
    expect(spyToModelMethod).toHaveBeenCalledTimes(1)
  })

  it('should convert an Domain Filter CastMember to Filter Model ', () => {
    const spyMethod = jest.spyOn(CastMemberMapper, 'filterToModel')
    const domainFilter: CastMemberFilter = {
      name: 'ok',
      type: CastMemberType.ACTOR,
    }
    const modelFilter: Prisma.CastMemberWhereInput =
      CastMemberMapper.filterToModel(domainFilter)

    const expectedModelFilter: Prisma.CastMemberWhereInput = {
      name: { contains: 'ok', mode: 'insensitive' },
      type: PrismaCastMemberType.ACTOR,
    }
    expect(modelFilter).toStrictEqual(expectedModelFilter)
    expect(spyMethod).toHaveBeenCalledTimes(1)
  })
  it('should convert an Domain Search Params to Model Search Params ', () => {
    const spyFilterMethod = jest.spyOn(CastMemberMapper, 'filterToModel')
    const spySearchToModelMethod = jest.spyOn(CastMemberMapper, 'filterToModel')

    const domainSearchParams: CastMemberSearchParams =
      new CastMemberSearchParams({
        filter: { name: 'foo', type: CastMemberType.ACTOR },
        page: 4,
        perPage: 40,
        sort: 'name',
        sortDir: 'desc',
      })
    const searchParamsModel: Prisma.CastMemberFindManyArgs =
      CastMemberMapper.searchParamsToModel(domainSearchParams)

    const expectedSearchParamsModel: Prisma.CastMemberFindManyArgs = {
      where: {
        name: { contains: 'foo', mode: 'insensitive' },
        type: PrismaCastMemberType.ACTOR,
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
    const spyFilterMethod = jest.spyOn(CastMemberMapper, 'filterToModel')
    const spySearchToModelMethod = jest.spyOn(CastMemberMapper, 'filterToModel')

    const domainSearchParams: CastMemberSearchParams =
      new CastMemberSearchParams()
    const searchParamsModel: Prisma.CastMemberFindManyArgs =
      CastMemberMapper.searchParamsToModel(domainSearchParams)

    const expectedSearchParamsModel: Prisma.CastMemberFindManyArgs = {
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

    const modelCastMember = {
      name: 'name',
      created_at: date,
      id: null,
      type: 'asda',
    }
    expect(() => {
      CastMemberMapper.toEntity(modelCastMember as any)
    }).toThrow(LoadEntityError)
  })
})
