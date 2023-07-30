import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '../../../../../@shared/domain'
import { CastMemberFakeBuilder, CastMemberType } from '../../../../domain'
import { PrismaCastMemberRepository } from '../../../../infra/repository/prisma/prisma-cast-member.repository'
import { UpdateCastMemberUseCase } from '../../update-cast-member.usecase'

describe('UpdateCastMemberUseCase Unit Tests', () => {
  const prisma = new PrismaClient()
  let repository: PrismaCastMemberRepository
  let useCase: UpdateCastMemberUseCase
  beforeEach(async () => {
    repository = new PrismaCastMemberRepository(prisma)
    useCase = new UpdateCastMemberUseCase(repository)
    await prisma.castMember.deleteMany()
  })
  it('should update an castMember', async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build()
    await repository.insert(entity)

    const spyUpdateRepoMethod = jest.spyOn(repository, 'update')
    const output = await useCase.execute({
      id: entity.id,
      name: 'foo',
      type: CastMemberType.DIRECTOR,
    })

    expect(output).toStrictEqual({
      id: entity.id,
      created_at: entity.createdAt,
      name: 'foo',
      type: CastMemberType.DIRECTOR,
    })
    expect(spyUpdateRepoMethod).toHaveBeenCalledTimes(1)

    const fromDb = await repository.findById(entity.id)
    expect(fromDb.toJSON()).toEqual({
      id: entity.id,
      created_at: entity.createdAt,
      name: 'foo',
      type: CastMemberType.DIRECTOR,
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
