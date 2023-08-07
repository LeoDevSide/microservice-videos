/* eslint-disable dot-notation */
import { GenresController } from '../../genres.controller'
import { CreateGenreDto } from '../../dto/create-genre.dto'
import {
  CreateGenreOutputDTO,
  FetchGenresOutputDTO,
  UpdateGenreOutputDTO,
} from '@me/micro-videos/src/genre/application'
import { UpdateGenreDto } from '../../dto/update-genre.dto'
import { SearchGenresDTO } from '../../dto/search-genres.dto'
import { GenreCollectionPresenter } from '../../presenter/genres.presenter'
describe('GenresController Unit Test', () => {
  let controller: GenresController

  beforeEach(async () => {
    controller = new GenresController()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a genre', async () => {
    const input: CreateGenreDto = {
      name: 'test',
      categories_id: ['123', '321'],
      is_active: true,
    }

    const expectedOutput: CreateGenreOutputDTO = {
      name: 'test',
      id: 'test',
      categories_id: ['123', '321'],
      is_active: true,
      created_at: new Date(),
    }
    const mockCreateGenreUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    }

    controller['createGenreUseCase'] = mockCreateGenreUseCase as any
    const output = await controller.create(input)
    expect(mockCreateGenreUseCase.execute).toHaveBeenCalledWith(input)
    expect(controller).toBeDefined()
    expect(output).toEqual(expectedOutput)
  })

  it('should updates a genre', async () => {
    const input: UpdateGenreDto = {
      name: 'test',
      categories_id: ['123', '321'],
      is_active: true,
    }

    const expectedOutput: UpdateGenreOutputDTO = {
      name: 'test',
      id: 'test',
      categories_id: ['123', '321'],
      is_active: true,
      created_at: new Date(),
    }
    const mockUpdateGenreUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    }

    controller['updateGenreUseCase'] = mockUpdateGenreUseCase as any
    const output = await controller.update('test', input)
    expect(mockUpdateGenreUseCase.execute).toHaveBeenCalledWith({
      id: 'test',
      ...input,
    })
    expect(controller).toBeDefined()
    expect(output).toEqual(expectedOutput)
  })

  it('should gets a genre', async () => {
    const expectedOutput: UpdateGenreOutputDTO = {
      name: 'test',
      id: 'test',
      categories_id: ['123', '321'],
      is_active: true,
      created_at: new Date(),
    }
    const mockUpdateGenreUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    }

    controller['getGenreUseCase'] = mockUpdateGenreUseCase as any
    const output = await controller.findOne('test')
    expect(mockUpdateGenreUseCase.execute).toHaveBeenCalledWith({
      id: 'test',
    })
    expect(controller).toBeDefined()
    expect(output).toEqual(expectedOutput)
  })

  it('should fetch genres', async () => {
    const input: SearchGenresDTO = {
      filter: { name: 'foo', categoryId: '123' },
      page: 1,
      per_page: 4,
      sort: 'name',
      sort_dir: 'asc',
    }

    const expectedOutput: FetchGenresOutputDTO = {
      items: [
        {
          name: 'foo',
          created_at: new Date(),
          id: 'anything',
          categories_id: ['123', '321'],
          is_active: true,
        },
        {
          name: 'foo 2',
          created_at: new Date(),
          id: 'anything 2',
          categories_id: ['123', '321'],
          is_active: true,
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 4,
      total: 2,
    }
    const mockUpdateGenreUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    }
    const expectedResponse = new GenreCollectionPresenter(expectedOutput)

    controller['fetchGenresUseCase'] = mockUpdateGenreUseCase as any
    const response = await controller.search(input)
    expect(mockUpdateGenreUseCase.execute).toHaveBeenCalledWith(input)
    expect(controller).toBeDefined()
    expect(response).toEqual(expectedResponse)
  })
})
