import UseCase from '../../../@shared/application/usecase'
import { ICategoryRepository } from '../../infra/repository/category.repository'

type InputDTO = {
  id: string
  name?: string
  description?: string
  is_active?: boolean
}

type OutputDTO = {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: Date
}

export class UpdateCategoryUsecase implements UseCase<InputDTO, OutputDTO> {
  constructor(private categoryRepository: ICategoryRepository) {}
  async execute(input: InputDTO): Promise<OutputDTO> {
    const foundCategoryEntity = await this.categoryRepository.findById(input.id)

    if (!foundCategoryEntity) {
      // TODO
    }

    foundCategoryEntity.update({
      description: input.description ?? foundCategoryEntity.description,
      name: input.name ?? foundCategoryEntity.name,
    })

    if (input.is_active === true) foundCategoryEntity.activate()
    if (input.is_active === false) foundCategoryEntity.deactivate()

    await this.categoryRepository.update(foundCategoryEntity)

    const output: OutputDTO = {
      id: foundCategoryEntity.id,
      name: foundCategoryEntity.name,
      description: foundCategoryEntity.description,
      is_active: foundCategoryEntity.isActive,
      created_at: foundCategoryEntity.createdAt,
    }
    return output
  }
}
