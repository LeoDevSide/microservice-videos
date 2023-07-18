import { PrismaClient } from '@prisma/client'
import { NotFoundError, UniqueEntityId } from '../../../../@shared/domain'
import { CategoryEntity } from '../../../domain'
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from '../category.repository'
import { CategoryModelMapper } from './category.mapper'
export class PrismaCategoryRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at']

  constructor(private prisma: PrismaClient) {}

  private async _getOrThrow(
    id: string | UniqueEntityId,
  ): Promise<CategoryEntity> {
    const foundCategoryDb = await this.prisma.category.findUnique({
      where: { id: id.toString() },
    })
    if (!foundCategoryDb)
      throw new NotFoundError(`Category ${id} not found in db`)
    return CategoryModelMapper.toEntity(foundCategoryDb)
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const totalCount = await this.prisma.category.count({
      where: props.filter ? { name: { contains: props.filter } } : undefined,
    })
    const fetchCategories = await this.prisma.category.findMany({
      take: props.perPage,
      orderBy: { [props.sort ?? 'created_at']: props.sortDir ?? 'desc' },
      skip: (props.page - 1) * props.perPage,
      where: props.filter ? { name: { contains: props.filter } } : undefined, // todo : make filter acceps an object with properties to filter
    })
    const categoriesEntities = fetchCategories.map((category) =>
      CategoryModelMapper.toEntity(category),
    )
    return new CategorySearchResult({
      items: categoriesEntities,
      currentPage: props.page,
      filter: props.filter,
      perPage: props.perPage,
      sort: props.sort,
      sortDir: props.sortDir,
      total: totalCount,
    })
  }

  async insert(entity: CategoryEntity): Promise<void> {
    await this.prisma.category.create({
      data: {
        ...entity.toJSON(),
      },
    })
  }

  async findById(id: string | UniqueEntityId): Promise<CategoryEntity> {
    const foundCategoryEntity = this._getOrThrow(id)

    return foundCategoryEntity
  }

  async findAll(): Promise<CategoryEntity[]> {
    const foundCategories = await this.prisma.category.findMany()
    const foundCategoriesEntities = foundCategories.map((categoryDb) =>
      CategoryModelMapper.toEntity(categoryDb),
    )
    return foundCategoriesEntities
  }

  async update(entity: CategoryEntity): Promise<void> {
    await this._getOrThrow(entity.id)
    await this.prisma.category.update({
      where: { id: entity.id },
      data: { ...entity.toJSON() },
    })
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const foundCategoryEntity = await this._getOrThrow(id)
    await this.prisma.category.delete({ where: { id: foundCategoryEntity.id } })
  }
}
