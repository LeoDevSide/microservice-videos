/* eslint-disable no-unused-vars */
import { Prisma, PrismaClient } from '@prisma/client'
import { NotFoundError, UniqueEntityId } from '../../../../@shared/domain'
import { CastMemberEntity } from '../../../domain'
import {
  CastMemberSearchParams,
  CastMemberSearchResult,
  ICastMemberRepository,
} from '../cast-member.repository'
import { CastMemberMapper } from './cast-member.mapper'

enum PrismaCastMemberType {
  DIRECTOR = 'DIRECTOR',
  ACTOR = 'ACTOR',
}

export class PrismaCastMemberRepository implements ICastMemberRepository {
  sortableFields: string[] = ['name', 'created_at', 'type']

  constructor(private prisma: PrismaClient) {}

  private async _getOrThrow(
    id: string | UniqueEntityId,
  ): Promise<CastMemberEntity> {
    const foundCastMemberDb = await this.prisma.castMember.findUnique({
      where: { id: id.toString() },
    })
    if (!foundCastMemberDb)
      throw new NotFoundError(`CastMember ${id} not found in db`)
    return CastMemberMapper.toEntity(foundCastMemberDb)
  }

  async search(
    params: CastMemberSearchParams,
  ): Promise<CastMemberSearchResult> {
    const prismaSearchInput = CastMemberMapper.searchParamsToModel(params)

    const totalCount = await this.prisma.castMember.count({
      where: prismaSearchInput.where,
    })

    const fetchCategories = await this.prisma.castMember.findMany(
      prismaSearchInput,
    )

    const categoriesEntities = fetchCategories.map((castMember) =>
      CastMemberMapper.toEntity(castMember),
    )

    return new CastMemberSearchResult({
      items: categoriesEntities,
      currentPage: params.page,
      filter: params.filter,
      perPage: params.perPage,
      sort: params.sort,
      sortDir: params.sortDir,
      total: totalCount,
    })
  }

  async insert(entity: CastMemberEntity): Promise<void> {
    const entityToModel = CastMemberMapper.toModel(entity)
    await this.prisma.castMember.create({
      data: entityToModel,
    })
  }

  async bulkInsert(entities: CastMemberEntity[]): Promise<void> {
    const entitiesToModel = entities.map((entity) =>
      CastMemberMapper.toModel(entity),
    )
    await this.prisma.castMember.createMany({
      data: entitiesToModel,
    })
  }

  async findById(id: string | UniqueEntityId): Promise<CastMemberEntity> {
    const foundCastMemberEntity = this._getOrThrow(id)

    return foundCastMemberEntity
  }

  async findAll(): Promise<CastMemberEntity[]> {
    const foundCategories = await this.prisma.castMember.findMany()
    const foundCategoriesToEntity = foundCategories.map((castMemberDb) =>
      CastMemberMapper.toEntity(castMemberDb),
    )
    return foundCategoriesToEntity
  }

  async update(entity: CastMemberEntity): Promise<void> {
    const entityToModel = CastMemberMapper.toModel(entity)
    await this._getOrThrow(entity.id)
    await this.prisma.castMember.update({
      where: { id: entity.id },
      data: entityToModel,
    })
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const foundCastMemberEntity = await this._getOrThrow(id)
    await this.prisma.castMember.delete({
      where: { id: foundCastMemberEntity.id },
    })
  }
}
