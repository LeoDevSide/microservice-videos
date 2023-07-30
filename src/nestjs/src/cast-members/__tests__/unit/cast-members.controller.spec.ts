/* eslint-disable dot-notation */
import { CastMembersController } from '../../cast-members.controller'
import { CreateCastMemberDto } from '../../dto/create-cast-member.dto'
import {
  CreateCastMemberOutputDTO,
  FetchCastMembersOutputDTO,
  UpdateCastMemberOutputDTO,
} from '@me/micro-videos/src/cast-member/application'
import { UpdateCastMemberDto } from '../../dto/update-cast-member.dto'
import { CastMemberType } from '@me/micro-videos/src/cast-member/domain'
import { SearchCastMembersDTO } from '../../dto/search-cast-members.dto'
import { CastMemberCollectionPresenter } from '../../presenter/cast-members.presenter'
describe('CastMembersController Unit Test', () => {
  let controller: CastMembersController

  beforeEach(async () => {
    controller = new CastMembersController()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a castMember', async () => {
    const input: CreateCastMemberDto = {
      name: 'test',
      type: CastMemberType.ACTOR,
    }

    const expectedOutput: CreateCastMemberOutputDTO = {
      name: 'test',
      id: 'test',
      type: CastMemberType.ACTOR,
      created_at: new Date(),
    }
    const mockCreateCastMemberUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    }

    controller['createCastMemberUseCase'] = mockCreateCastMemberUseCase as any
    const output = await controller.create(input)
    expect(mockCreateCastMemberUseCase.execute).toHaveBeenCalledWith(input)
    expect(controller).toBeDefined()
    expect(output).toEqual(expectedOutput)
  })

  it('should updates a castMember', async () => {
    const input: UpdateCastMemberDto = {
      name: 'test',
      type: CastMemberType.ACTOR,
    }

    const expectedOutput: UpdateCastMemberOutputDTO = {
      name: 'test',
      id: 'test',
      type: CastMemberType.ACTOR,
      created_at: new Date(),
    }
    const mockUpdateCastMemberUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    }

    controller['updateCastMemberUseCase'] = mockUpdateCastMemberUseCase as any
    const output = await controller.update('test', input)
    expect(mockUpdateCastMemberUseCase.execute).toHaveBeenCalledWith({
      id: 'test',
      ...input,
    })
    expect(controller).toBeDefined()
    expect(output).toEqual(expectedOutput)
  })

  it('should gets a castMember', async () => {
    const expectedOutput: UpdateCastMemberOutputDTO = {
      name: 'test',
      id: 'test',
      type: CastMemberType.ACTOR,
      created_at: new Date(),
    }
    const mockUpdateCastMemberUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    }

    controller['getCastMemberUseCase'] = mockUpdateCastMemberUseCase as any
    const output = await controller.findOne('test')
    expect(mockUpdateCastMemberUseCase.execute).toHaveBeenCalledWith({
      id: 'test',
    })
    expect(controller).toBeDefined()
    expect(output).toEqual(expectedOutput)
  })

  it('should fetch castMembers', async () => {
    const input: SearchCastMembersDTO = {
      filter: { name: 'foo', type: CastMemberType.ACTOR },
      page: 1,
      per_page: 4,
      sort: 'name',
      sort_dir: 'asc',
    }

    const expectedOutput: FetchCastMembersOutputDTO = {
      items: [
        {
          name: 'foo',
          created_at: new Date(),
          id: 'anything',
          type: CastMemberType.ACTOR,
        },
        {
          name: 'foo 2',
          created_at: new Date(),
          id: 'anything 2',
          type: CastMemberType.ACTOR,
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 4,
      total: 2,
    }
    const mockUpdateCastMemberUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    }
    const expectedResponse = new CastMemberCollectionPresenter(expectedOutput)

    controller['fetchCastMembersUseCase'] = mockUpdateCastMemberUseCase as any
    const response = await controller.search(input)
    expect(mockUpdateCastMemberUseCase.execute).toHaveBeenCalledWith(input)
    expect(controller).toBeDefined()
    expect(response).toEqual(expectedResponse)
  })
})
