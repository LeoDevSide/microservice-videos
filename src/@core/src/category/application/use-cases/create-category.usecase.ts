import UseCase from '../../../@shared/application/usecase'
import { CategoryEntity } from '../../domain/entities/category.entity'
import { ICategoryRepository } from '../../infra/repository/category.repository'

export type CreateCategoryInputDTO = {
  name: string
  description?: string
  isActive?: boolean
}

export type CreateCategoryOutputDTO = {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: Date
}

export class CreateCategoryUseCase
  implements UseCase<CreateCategoryInputDTO, CreateCategoryOutputDTO>
{
  constructor(private categoryRepository: ICategoryRepository) {}
  async execute(
    input: CreateCategoryInputDTO,
  ): Promise<CreateCategoryOutputDTO> {
    const categoryEntity = new CategoryEntity({
      name: input.name,
      description: input.description ?? null,
      isActive: input.isActive ?? null,
    })
    await this.categoryRepository.insert(categoryEntity)

    const output: CreateCategoryOutputDTO = {
      id: categoryEntity.id,
      name: categoryEntity.name,
      description: categoryEntity.description,
      is_active: categoryEntity.isActive,
      created_at: categoryEntity.createdAt,
    }
    return output
  }
}
