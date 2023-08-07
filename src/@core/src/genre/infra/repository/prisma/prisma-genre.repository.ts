/* eslint-disable no-unused-vars */
import { Prisma, PrismaClient } from '@prisma/client'
import {
  Entity,
  NotFoundError,
  UniqueEntityId,
} from '../../../../@shared/domain'
import { GenreEntity } from '../../../domain'
import {
  GenreSearchParams,
  GenreSearchResult,
  IGenreRepository,
} from '../genre.repository'
import { GenreMapper } from './genre.mapper'

export class PrismaGenreRepository implements IGenreRepository {
  sortableFields: string[] = ['name', 'created_at']

  constructor(private prisma: PrismaClient) {}

  private async _getOrThrow(id: string | UniqueEntityId): Promise<GenreEntity> {
    const foundGenreDb = await this.prisma.genre.findUnique({
      where: { id: id.toString() },
      include: { categories: true },
    })
    if (!foundGenreDb) throw new NotFoundError(`Genre ${id} not found in db`)
    return GenreMapper.toEntity(foundGenreDb)
  }

  async search(params: GenreSearchParams): Promise<GenreSearchResult> {
    const prismaSearchInput = GenreMapper.searchParamsToModel(params)

    const totalCount = await this.prisma.genre.count({
      where: prismaSearchInput.where,
    })

    const fetchGenres = await this.prisma.genre.findMany({
      ...prismaSearchInput,
      include: { categories: true },
    })

    const genresEntities = fetchGenres.map((genre) =>
      GenreMapper.toEntity(genre),
    )

    return new GenreSearchResult({
      items: genresEntities,
      currentPage: params.page,
      filter: params.filter,
      perPage: params.perPage,
      sort: params.sort,
      sortDir: params.sortDir,
      total: totalCount,
    })
  }

  async insert(entity: GenreEntity): Promise<void> {
    const createArgs = GenreMapper.toCreateModel(entity)
    await this.prisma.genre.create(createArgs)

    this.prisma.genre.create(createArgs)
  }

  async bulkInsert(entities: GenreEntity[]): Promise<void> {
    const entitiesToModel = entities.map((entity) =>
      GenreMapper.toModel(entity),
    )
    await this.prisma.genre.createMany({
      data: entitiesToModel,
    })
  }

  async findById(id: string | UniqueEntityId): Promise<GenreEntity> {
    const foundGenreEntity = this._getOrThrow(id)

    return foundGenreEntity
  }

  async findAll(): Promise<GenreEntity[]> {
    const foundCategories = await this.prisma.genre.findMany({
      include: { categories: true },
    })
    const foundCategoriesToEntity = foundCategories.map((genreDb) =>
      GenreMapper.toEntity(genreDb),
    )
    return foundCategoriesToEntity
  }

  async update(entity: GenreEntity): Promise<void> {
    // const updateArgs = GenreMapper.toUpdateModel(entity)
    await this._getOrThrow(entity.id)
    const update = this.prisma.genre.update({
      where: { id: entity.id },
      data: { name: entity.name, is_active: entity.isActive },
    })

    const deleteCurrentRelation = this.prisma.genreOnCategories.deleteMany({
      where: { genre_id: entity.id },
    })

    const toArray = GenreMapper._categoriesIdMapToArray(entity.categoriesId)

    const addNewRelation = this.prisma.genreOnCategories.createMany({
      data: toArray.map((categoryId) => ({
        category_id: categoryId,
        genre_id: entity.id,
      })),
    })
    await this.prisma.$transaction([
      update,
      deleteCurrentRelation,
      addNewRelation,
    ])
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const foundGenreEntity = await this._getOrThrow(id)
    const relationExists = foundGenreEntity.categoriesId.size > 0

    if (relationExists) {
      const deleteRelation = this.prisma.genreOnCategories.deleteMany({
        where: { genre_id: id.toString() },
      })
      const deleteGenre = this.prisma.genre.delete({
        where: { id: foundGenreEntity.id },
      })
      await this.prisma.$transaction([deleteRelation, deleteGenre])
      return
    }

    await this.prisma.genre.delete({
      where: { id: foundGenreEntity.id },
    })
  }
}
