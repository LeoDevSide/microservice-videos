/* eslint-disable dot-notation */
import { CategoriesController } from '../../categories.controller'
import { CreateCategoryDto } from '../../dto/create-category.dto'
import {
  CreateCategoryOutputDTO,
  UpdateCategoryOutputDTO,
} from '@me/micro-videos/src/category/application'
import { UpdateCategoryDto } from '../../dto/update-category.dto'
describe('CategoriesController Unit Test', () => {
  let controller: CategoriesController

  beforeEach(async () => {
    controller = new CategoriesController()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a category', async () => {
    const input: CreateCategoryDto = {
      name: 'test',
      description: 'test',
      is_active: false,
    }

    const expectedOutput: CreateCategoryOutputDTO = {
      name: 'test',
      description: 'test',
      is_active: false,
      id: 'test',
      created_at: new Date(),
    }
    const mockCreateCategoryUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    }

    controller['createCategoryUseCase'] = mockCreateCategoryUseCase as any
    const output = await controller.create(input)
    expect(mockCreateCategoryUseCase.execute).toHaveBeenCalledWith({
      name: 'test',
      description: 'test',
      isActive: false,
    })
    expect(controller).toBeDefined()
    expect(output).toEqual(expectedOutput)
  })

  it('should updates a category', async () => {
    const input: UpdateCategoryDto = {
      name: 'test',
      description: 'test',
      is_active: false,
    }

    const expectedOutput: UpdateCategoryOutputDTO = {
      name: 'test',
      description: 'test',
      is_active: false,
      id: 'test',
      created_at: new Date(),
    }
    const mockUpdateCategoryUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    }

    controller['updateCategoryUseCase'] = mockUpdateCategoryUseCase as any
    const output = await controller.update('test', input)
    expect(mockUpdateCategoryUseCase.execute).toHaveBeenCalledWith({
      id: 'test',
      name: 'test',
      description: 'test',
      is_active: false,
    })
    expect(controller).toBeDefined()
    expect(output).toEqual(expectedOutput)
  })

  it('should gets a category', () => {
    expect(controller).toBeDefined()
  })

  it('should fetch categories', () => {
    expect(controller).toBeDefined()
  })
})
