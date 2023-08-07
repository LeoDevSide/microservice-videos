/* eslint-disable no-unused-vars */
import { Prisma } from '@prisma/client'
import { GenreEntity } from '../../../domain'
import { UniqueEntityId } from '../../../../@shared/domain'
import { EntityValidationError } from '../../../../@shared/domain/errors/validation.error'
import { LoadEntityError } from '../../../../@shared/domain/errors/load-entity.error'
import { GenreFilter, GenreSearchParams } from '../genre.repository'

export enum PrismaGenreType {
  DIRECTOR = 'DIRECTOR',
  ACTOR = 'ACTOR',
}

export interface PrismaGenreAggregateOutputModel
  extends Prisma.GenreMinAggregateOutputType {
  categories?: Prisma.GenreOnCategoriesMaxAggregateOutputType[]
}

export class GenreMapper {
  static _categoriesIdMapToArray(map: Map<string, UniqueEntityId>): string[] {
    return Array.from(map.keys())
  }

  static toEntity(genreModel: PrismaGenreAggregateOutputModel): GenreEntity {
    const { categories, id, ...otherProps } = genreModel
    if (!categories) throw new Error('Must have categories')
    const categoriesId = categories.map((category) => category.category_id)
    try {
      const entity = GenreEntity.create(
        {
          categoriesId,
          name: otherProps.name,
          createdAt: otherProps.created_at,
          isActive: otherProps.is_active,
        },
        new UniqueEntityId(id),
      )
      return entity
    } catch (e) {
      if (e instanceof EntityValidationError) {
        throw new LoadEntityError(e.errors)
      }
      throw e
    }
  }

  static toModel(entity: GenreEntity) {
    return {
      id: entity.id,
      name: entity.name,
      is_active: entity.isActive,
      created_at: entity.createdAt,
      // categoriesId: Array.from(entity.categoriesId.keys()),
    }
  }

  // static toUpdateModel(entity: GenreEntity): Prisma.GenreUpdateArgs {
  //   const toArray = GenreMapper._categoriesIdMapToArray(entity.categoriesId)
  //   const setInput: {
  //     genre_id_category_id: { category_id: string; genre_id: string }
  //   }[] = toArray.map((idString) => ({
  //     genre_id_category_id: {
  //       category_id: idString,
  //       genre_id: entity.id,
  //     },
  //     category_id: idString,
  //     genre_id: entity.id,
  //   }))

  //   return {
  //     where: { id: entity.id },
  //     data: {
  //       name: entity.name,
  //       is_active: entity.isActive,
  //       categories: {
  //         set: entity.categoriesId.size > 0 ? setInput : undefined,
  //       },
  //     },
  //   }
  // }

  static toCreateModel(entity: GenreEntity): Prisma.GenreCreateArgs {
    const toArray = GenreMapper._categoriesIdMapToArray(entity.categoriesId)
    // const connectInput: { category: { connect: { id: string } } }[] =
    //   toArray.map((idString) => ({
    //     category: {
    //       connect: { id: idString },
    //     },
    //   }))
    const connectInput: { category_id: string }[] = toArray.map((idString) => ({
      category_id: idString,
    }))

    return {
      data: {
        id: entity.id,
        name: entity.name,
        is_active: entity.isActive,
        created_at: entity.createdAt,
        categories: {
          create: entity.categoriesId.size > 0 ? connectInput : undefined,
        },
        // categories: {
        //   connect: entity.categoriesId.size > 0 ? connectInput : undefined,
        // },
      },
    }
  }

  static filterToModel(filter: GenreFilter): Prisma.GenreWhereInput {
    const prismaFilter: Prisma.GenreWhereInput = {}
    if (!filter) {
      return undefined
    }
    if (filter.name) {
      prismaFilter.name = { contains: filter.name, mode: 'insensitive' }
    }

    if (filter.is_active !== undefined || null) {
      prismaFilter.is_active = { equals: filter.is_active }
    }
    if (filter.categoryId) {
      prismaFilter.categories = {
        some: { category_id: { equals: filter.categoryId } },
      }
    }
    return prismaFilter
  }

  static searchParamsToModel(
    params: GenreSearchParams,
  ): Prisma.GenreFindManyArgs {
    if (!params) {
      throw new Error('Search Params must be provided')
    }
    const { sortDir, sort, filter, page, perPage } = params
    const prismaFilter: Prisma.GenreWhereInput =
      GenreMapper.filterToModel(filter)

    const defaultSort: Prisma.GenreOrderByWithRelationInput = {
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
