import { NotFoundError } from '../../../../../@shared/domain'
import { CastMemberFakeBuilder, CastMemberType } from '../../../../domain'
import { InMemoryCastMemberRepository } from '../../../../infra/repository/in-memory/in-memory-cast-member.repository'
import { UpdateCastMemberUseCase } from '../../update-cast-member.usecase'

describe('UpdateCastMemberUseCase Unit Tests', () => {
  let repository: InMemoryCastMemberRepository
  let useCase: UpdateCastMemberUseCase
  beforeEach(() => {
    repository = new InMemoryCastMemberRepository()
    useCase = new UpdateCastMemberUseCase(repository)
  })
  it('should update an existent castMember', async () => {
    const castMemberEntity = CastMemberFakeBuilder.aCastMember().build()
    await repository.insert(castMemberEntity)
    const spyMethod = jest.spyOn(repository, 'update')
    expect(repository.items.length).toBe(1)

    const input = {
      id: castMemberEntity.id,
      name: 'updated name',
      type: CastMemberType.ACTOR,
    }

    const output = await useCase.execute(input)

    expect(output.name).toBe('updated name')
    expect(output.type).toBe(CastMemberType.ACTOR)
    expect(output.id).toBe(castMemberEntity.id)
    expect(output.created_at).toBeTruthy()

    expect(spyMethod).toHaveBeenCalledTimes(1)
  })

  it('should not update an not found castMember and throws a error', async () => {
    const spyMethod = jest.spyOn(repository, 'update')

    const input = {
      id: 'inexistent',
      name: 'updated name',
      type: CastMemberType.ACTOR,
    }

    expect(async () => {
      await useCase.execute(input)
    }).rejects.toThrow(NotFoundError)

    expect(spyMethod).toHaveBeenCalledTimes(0)
  })
})
