import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '../../../../../@shared/domain'
import { CastMemberFakeBuilder } from '../../../../domain'
import { GetCastMemberUseCase } from '../../get-cast-member.usecase'
import { PrismaCastMemberRepository } from '../../../../infra/repository/prisma/prisma-cast-member.repository'

describe('GetCastMemberUseCase Unit Tests', () => {
  const prisma = new PrismaClient()
  let repository: PrismaCastMemberRepository
  let useCase: GetCastMemberUseCase
  beforeEach(async () => {
    repository = new PrismaCastMemberRepository(prisma)
    useCase = new GetCastMemberUseCase(repository)
    await prisma.castMember.deleteMany()
  })
  it('should find an castMember with valid id', async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build()
    await repository.insert(entity)

    const spyFindByIdRepoMethod = jest.spyOn(repository, 'findById')
    const output = await useCase.execute({ id: entity.id })

    expect(output).toStrictEqual({
      id: entity.id,
      created_at: entity.createdAt,
      name: entity.name,
      type: entity.type,
    })
    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })

  it('should throws an error when not found an castMember with inexistent id ', async () => {
    const spyFindByIdRepoMethod = jest.spyOn(repository, 'findById')

    expect(async () => {
      await useCase.execute({ id: 'someInexistentId' })
    }).rejects.toThrow(NotFoundError)
    expect(spyFindByIdRepoMethod).toHaveBeenCalledTimes(1)
  })
})
