import { PrismaClient } from '@prisma/client'
import { NotFoundError, UniqueEntityId } from '../../../../../@shared/domain'
import { GenreFakeBuilder } from '../../../../domain'
import { PrismaGenreRepository } from '../../../../infra/repository/prisma/prisma-genre.repository'
import { DeleteGenreUseCase } from '../../delete-genre.usecase'
import { CategoryFakeBuilder } from '../../../../../category/domain'

describe('DeleteGenreUseCase Unit Tests', () => {
  const prisma = new PrismaClient()
  let repository: PrismaGenreRepository
  let useCase: DeleteGenreUseCase
  let categoryId: string
  const category = CategoryFakeBuilder.aCategory().build()

  beforeAll(async () => {
    await prisma.category.create({ data: { ...category.toJSON() } })
    categoryId = category.id
  })

  beforeEach(async () => {
    repository = new PrismaGenreRepository(prisma)
    useCase = new DeleteGenreUseCase(repository)
    await prisma.genre.deleteMany()
  })
  it('should delete an genre', async () => {
    const entity = GenreFakeBuilder.aGenre()
      .withCategoryId(new UniqueEntityId(categoryId))
      .build()
    await repository.insert(entity)
    let fromDb = await repository.findAll()
    expect(fromDb.length).toBe(1)

    const spyDeleteRepoMethod = jest.spyOn(repository, 'delete')
    await useCase.execute({
      id: entity.id,
    })

    expect(spyDeleteRepoMethod).toHaveBeenCalledTimes(1)

    fromDb = await repository.findAll()
    expect(fromDb.length).toBe(0)
  })

  it('should not delete an not found cast-member and throws a error', async () => {
    const spyMethod = jest.spyOn(repository, 'delete')

    const input = {
      id: 'inexistent',
    }

    expect(async () => {
      await useCase.execute(input)
    }).rejects.toThrow(NotFoundError)

    expect(spyMethod).toHaveBeenCalledTimes(0)
  })
})
