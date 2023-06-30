import UseCase from '../../../@shared/application/usecase'
import { CategoryEntity } from '../../domain/entities/category.entity'
import { ICategoryRepository } from '../../infra/repository/category.repository'

type InputDTO = {
  name: string
  description?: string
  isActive?: boolean
}

type OutputDTO = {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: Date
}

export class CreateCategoryUseCase implements UseCase<InputDTO, OutputDTO> {
  constructor(private categoryRepository: ICategoryRepository) {}
  async execute(input: InputDTO): Promise<OutputDTO> {
    const categoryEntity = new CategoryEntity({
      name: input.name,
      description: input.description ?? null,
      isActive: input.isActive ?? null,
    })
    await this.categoryRepository.insert(categoryEntity)

    const output: OutputDTO = {
      id: categoryEntity.id,
      name: categoryEntity.name,
      description: categoryEntity.description,
      is_active: categoryEntity.isActive,
      created_at: categoryEntity.createdAt,
    }
    return output
  }
}
