/* eslint-disable no-unused-vars */
import { Prisma } from '@prisma/client'
import { CastMemberEntity, CastMemberType } from '../../../domain'
import { UniqueEntityId } from '../../../../@shared/domain'
import { EntityValidationError } from '../../../../@shared/domain/errors/validation.error'
import { LoadEntityError } from '../../../../@shared/domain/errors/load-entity.error'
import {
  CastMemberFilter,
  CastMemberSearchParams,
} from '../cast-member.repository'

export enum PrismaCastMemberType {
  DIRECTOR = 'DIRECTOR',
  ACTOR = 'ACTOR',
}

export class CastMemberMapper {
  static _toTypePropModel(type: CastMemberType): PrismaCastMemberType {
    return PrismaCastMemberType[CastMemberType[type]]
  }

  static _toTypePropDomain(type: string): CastMemberType {
    return CastMemberType[type]
  }

  static toEntity(
    castMemberModel: Prisma.CastMemberMaxAggregateOutputType,
  ): CastMemberEntity {
    const { id, ...props } = castMemberModel
    try {
      return new CastMemberEntity(
        {
          name: props.name,
          createdAt: props.created_at,
          type: CastMemberMapper._toTypePropDomain(props.type),
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

  static toModel(
    entity: CastMemberEntity,
  ): Prisma.CastMemberMaxAggregateOutputType {
    return {
      id: entity.id,
      name: entity.name,
      type: CastMemberMapper._toTypePropModel(entity.type),
      created_at: entity.createdAt,
    }
  }

  static filterToModel(filter: CastMemberFilter): Prisma.CastMemberWhereInput {
    const prismaFilter: Prisma.CastMemberWhereInput = {}
    if (!filter) {
      return undefined
    }
    if (filter.name) {
      prismaFilter.name = { contains: filter.name, mode: 'insensitive' }
    }

    if (filter.type) {
      prismaFilter.type = CastMemberMapper._toTypePropModel(filter.type)
    }

    return prismaFilter
  }

  static searchParamsToModel(
    params: CastMemberSearchParams,
  ): Prisma.CastMemberFindManyArgs {
    if (!params) {
      throw new Error('Search Params must be provided')
    }
    const { sortDir, sort, filter, page, perPage } = params
    const prismaFilter: Prisma.CastMemberWhereInput =
      CastMemberMapper.filterToModel(filter)

    const defaultSort: Prisma.CastMemberOrderByWithRelationInput = {
      created_at: 'desc',
    }

    return {
      take: perPage,
      orderBy: sort ? { [sort]: sortDir } : defaultSort,
      where: filter ? prismaFilter : undefined,
      skip: (page - 1) * perPage,
    }
  }
}
