import { PrismaClient } from '@prisma/client'
import { NotFoundError, UniqueEntityId } from '../../../../../@shared/domain'
import { GenreFakeBuilder } from '../../../../domain'
import { PrismaGenreRepository } from '../../../../infra/repository/prisma/prisma-genre.repository'
import { UpdateGenreUseCase } from '../../update-genre.usecase'
import { CategoryFakeBuilder } from '../../../../../category/domain'

describe('UpdateGenreUseCase Unit Tests', () => {
  const prisma = new PrismaClient()
  let repository: PrismaGenreRepository
  let useCase: UpdateGenreUseCase

  const category = CategoryFakeBuilder.aCategory().build()
  const category2 = CategoryFakeBuilder.aCategory().build()

  const categoryId = new UniqueEntityId(category.id)
  const categoryId2 = new UniqueEntityId(category2.id)
  beforeAll(async () => {
    await prisma.category.create({ data: { ...category.toJSON() } })
    await prisma.category.create({ data: { ...category2.toJSON() } })
  })
  beforeEach(async () => {
    await prisma.genreOnCategories.deleteMany()
    await prisma.genre.deleteMany()

    repository = new PrismaGenreRepository(prisma)
    useCase = new UpdateGenreUseCase(repository)
  })
  it('should update an genre', async () => {
    const entity = GenreFakeBuilder.aGenre().withCategoryId(categoryId).build()
    await repository.insert(entity)

    const spyUpdateRepoMethod = jest.spyOn(repository, 'update')
    const output = await useCase.execute({
      id: entity.id,
      name: 'name updated',
      is_active: false,
      categories_id: [categoryId.value, categoryId2.value],
    })

    expect(output).toStrictEqual({
      id: entity.id,
      created_at: entity.createdAt,
      name: 'name updated',
      is_active: false,
      categories_id: [categoryId.value, categoryId2.value],
    })
    expect(spyUpdateRepoMethod).toHaveBeenCalledTimes(1)

    const fromDb = await repository.findById(entity.id)
    expect(fromDb.toJSON()).toEqual({
      id: entity.id,
      created_at: entity.createdAt,
      name: 'name updated',
      is_active: false,
      categories_id: [categoryId.value, categoryId2.value],
    })
  })

  it('should not update an not found category and throws a error', async () => {
    const spyMethod = jest.spyOn(repository, 'update')

    const input = {
      id: 'inexistent',
      description: 'updated description',
      name: 'updated name',
      is_active: false,
    }

    expect(async () => {
      await useCase.execute(input)
    }).rejects.toThrow(NotFoundError)

    expect(spyMethod).toHaveBeenCalledTimes(0)
  })
})
