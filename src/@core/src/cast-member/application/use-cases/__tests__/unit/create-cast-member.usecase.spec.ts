import { CastMemberType } from '../../../../domain'
import { InMemoryCastMemberRepository } from '../../../../infra/repository/in-memory/in-memory-cast-member.repository'
import { CreateCastMemberUseCase } from '../../create-cast-member.usecase'

describe('CreateCastMemberUseCase Unit Tests', () => {
  let repository: InMemoryCastMemberRepository
  let useCase: CreateCastMemberUseCase
  beforeEach(() => {
    repository = new InMemoryCastMemberRepository()
    useCase = new CreateCastMemberUseCase(repository)
  })
  it('should create a new castMember', async () => {
    const spyInsertRepoMethod = jest.spyOn(repository, 'insert')
    const output = await useCase.execute({
      name: 'test',
      type: CastMemberType.ACTOR,
    })

    expect(repository.items.length).toBe(1)
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      created_at: repository.items[0].createdAt,
      name: 'test',
      type: CastMemberType.ACTOR,
    })
    expect(spyInsertRepoMethod).toHaveBeenCalledTimes(1)
  })
})
