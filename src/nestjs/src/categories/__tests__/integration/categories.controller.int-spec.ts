import { Test } from '@nestjs/testing'
import { CategoriesController } from '../../categories.controller'
import { DatabaseModule } from '../../../database/database.module'
import { CategoriesModule } from '../../categories.module'
import {
  CreateCategoryUseCase,
  FetchCategoriesUseCase,
  GetCategoryUseCase,
  UpdateCategoryUsecase,
} from '@me/micro-videos/src/category/application'
import { CreateCategoryDto } from '../../dto/create-category.dto'
import { ICategoryRepository } from '@me/micro-videos/src/category/infra'
import { CATEGORY_PROVIDERS } from '../../categories.providers'
import { UpdateCategoryDto } from '../../dto/update-category.dto'
import {
  CategoryEntity,
  CategoryFakeBuilder,
} from '@me/micro-videos/src/category/domain'
import { SearchCategoriesDTO } from '../../dto/search-categories.dto'
import { PrismaService } from '../../../database/prisma/prisma.service'
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../../presenter/categories.presenter'

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController
  let repository: ICategoryRepository
  const db: PrismaService = new PrismaService()
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule, CategoriesModule],
    }).compile()

    controller = module.get<CategoriesController>(CategoriesController)
    repository = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    )
    await db.category.deleteMany()
  })
  it('Should be defined', () => {
    expect(controller).toBeDefined()
    expect(controller['createCategoryUseCase']).toBeInstanceOf(
      CreateCategoryUseCase,
    )
    expect(controller['fetchCategoriesUseCase']).toBeInstanceOf(
      FetchCategoriesUseCase,
    )
    expect(controller['getCategorysUseCase']).toBeInstanceOf(GetCategoryUseCase)
    expect(controller['updateCategoryUseCase']).toBeInstanceOf(
      UpdateCategoryUsecase,
    )
    expect(controller['create'])
  })

  it('should create a category', async () => {
    const input: CreateCategoryDto = {
      name: 'test',
      description: 'desc',
      is_active: false,
    }

    const presenter = await controller.create(input)
    expect(presenter.created_at).toBeDefined()
    expect(presenter.id).toBeDefined()
    expect(presenter.name).toBe(input.name)
    expect(presenter.description).toBe(input.description)
    expect(presenter.is_active).toBe(input.is_active)
    expect(presenter.created_at).toBeInstanceOf(Date)
    expect(presenter).toBeInstanceOf(CategoryPresenter)

    const entityFromDb = await repository.findById(presenter.id)

    expect(entityFromDb.id).toStrictEqual(presenter.id)
    expect(entityFromDb.createdAt).toStrictEqual(presenter.created_at)
  })

  it('should update a category', async () => {
    const input: UpdateCategoryDto = {
      name: 'test',
      description: 'desc',
      is_active: false,
    }
    const entity = new CategoryEntity({
      name: 'initial name',
      description: 'initial description',
      isActive: true,
    })
    await repository.insert(entity)

    const presenter = await controller.update(entity.id, input)
    expect(presenter.created_at).toBeDefined()
    expect(presenter.id).toBe(entity.id)
    expect(presenter.name).toBe(input.name)
    expect(presenter.description).toBe(input.description)
    expect(presenter.is_active).toBe(input.is_active)
    expect(presenter.created_at).toStrictEqual(entity.createdAt)
    expect(presenter).toBeInstanceOf(CategoryPresenter)

    const entityFromDb = await repository.findById(presenter.id)

    expect(entityFromDb.id).toStrictEqual(presenter.id)
    expect(entityFromDb.createdAt).toStrictEqual(presenter.created_at)
    expect(entityFromDb.toJSON()).toMatchObject(presenter)
  })
  describe('search method', () => {
    it('should fetch categories using query empty ordered by created_at', async () => {
      const categories = CategoryFakeBuilder.theCategories(4)
        .withName((index) => index + 'name')
        .withCreatedAt((index) => new Date(new Date().getTime() + index))
        .build()
      await repository.bulkInsert(categories)

      const arrange: { sendData: SearchCategoriesDTO; expected: any }[] = [
        {
          sendData: {},
          expected: new CategoryCollectionPresenter({
            items: [
              categories[3].toJSON(),
              categories[2].toJSON(),
              categories[1].toJSON(),
              categories[0].toJSON(),
            ],
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          }),
        },
        {
          sendData: { per_page: 2, page: 1 },
          expected: new CategoryCollectionPresenter({
            items: [categories[3].toJSON(), categories[2].toJSON()],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          }),
        },
      ]
      for (const item of arrange) {
        const presenter = await controller.search(item.sendData)
        expect(presenter).toStrictEqual(item.expected)
      }
    })
    it('should fetch categories using query with filter', async () => {
      const category = CategoryFakeBuilder.aCategory()
      const categories = [
        category.withName('a').build(),
        category.withName('AAA').build(),
        category.withName('AaA').build(),
        category.withName('b').build(),
        category.withName('c').build(),
      ]
      await repository.bulkInsert(categories)

      const arrange: { sendData: SearchCategoriesDTO; expected: any }[] = [
        {
          sendData: {
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'a',
          },
          expected: new CategoryCollectionPresenter({
            items: [categories[0].toJSON(), categories[2].toJSON()],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          }),
        },
        {
          sendData: {
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'a',
          },
          expected: new CategoryCollectionPresenter({
            items: [categories[1].toJSON()],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3,
          }),
        },
      ]
      for (const item of arrange) {
        const presenter = await controller.search(item.sendData)
        expect(presenter).toStrictEqual(item.expected)
      }
    })

    it('should fetch categories using query with sort props', async () => {
      const category = CategoryFakeBuilder.aCategory()
      const categories = [
        category.withName('a').build(),
        category.withName('AAA').build(),
        category.withName('AaA').build(),
        category.withName('b').build(),
        category.withName('c').build(),
      ]
      await repository.bulkInsert(categories)

      const arrange: { sendData: SearchCategoriesDTO; expected: any }[] = [
        {
          sendData: {
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'a',
            sort_dir: 'desc',
          },
          expected: new CategoryCollectionPresenter({
            items: [categories[1].toJSON(), categories[2].toJSON()],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          }),
        },
        {
          sendData: {
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'a',
            sort_dir: 'desc',
          },
          expected: new CategoryCollectionPresenter({
            items: [categories[0].toJSON()],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3,
          }),
        },
      ]
      for (const item of arrange) {
        const presenter = await controller.search(item.sendData)
        expect(presenter).toStrictEqual(item.expected)
      }
    })
  })

  it('should get a category', async () => {
    const entity = new CategoryEntity({
      name: 'initial name',
      description: 'initial description',
      isActive: true,
    })
    const input = entity.id
    await repository.insert(entity)

    const presenter = await controller.findOne(input)
    expect(presenter.created_at).toBeDefined()
    expect(presenter.id).toBe(entity.id)
    expect(presenter.name).toBe(entity.name)
    expect(presenter.description).toBe(entity.description)
    expect(presenter.is_active).toBe(entity.isActive)
    expect(presenter.created_at).toStrictEqual(entity.createdAt)
    expect(presenter).toBeInstanceOf(CategoryPresenter)
  })
})
